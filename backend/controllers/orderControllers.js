import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import User from "../models/user.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const itemsWithVendor = await Promise.all(
      cart.items.map(async (item) => {
        const plain = item.toObject ? item.toObject() : { ...item };
        try {
          const product = await Product.findById(plain.productId).select("vendorName").lean();
          if (product?.vendorName) plain.vendorName = product.vendorName;
        } catch {
          /* ignore */
        }
        return plain;
      }),
    );

    const order = new Order({
      userId,
      items: itemsWithVendor,
      total,
      shippingAddress: req.body.shippingAddress,
    });
    await order.save();

    // Clear cart after order placed
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const tailorVendorMatchNames = (userDoc) => {
  const business = userDoc?.tailorProfile?.businessName?.trim();
  const displayName = userDoc?.name?.trim();
  const names = [];
  if (business) names.push(business);
  if (displayName && displayName !== business) names.push(displayName);
  return names;
};

const orderMatchesTailor = (order, matchNames) => {
  if (!matchNames.length) return false;
  return order.items?.some(
    (item) => item.vendorName && matchNames.includes(String(item.vendorName).trim()),
  );
};

export const getTailorOrders = async (req, res) => {
  try {
    if (req.user.role !== "tailor") {
      return res.status(403).json({
        success: false,
        message: "Only tailors can access this resource",
      });
    }

    const tailor = await User.findById(req.user.id).select("tailorProfile name").lean();
    const matchNames = tailorVendorMatchNames(tailor);
    if (matchNames.length === 0) {
      return res.json({ success: true, orders: [] });
    }

    const orders = await Order.find({
      "items.vendorName": { $in: matchNames },
    })
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    const filtered = orders.filter((o) => orderMatchesTailor(o, matchNames));
    res.json({ success: true, orders: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "userId",
      "name email phone",
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const ownerRef = order.userId;
    const ownerIdStr = ownerRef?._id
      ? ownerRef._id.toString()
      : ownerRef.toString();

    if (ownerIdStr === req.user.id) {
      return res.json({ success: true, order });
    }

    if (req.user.role === "admin") {
      return res.json({ success: true, order });
    }

    if (req.user.role === "tailor") {
      const tailor = await User.findById(req.user.id).select("tailorProfile name").lean();
      const matchNames = tailorVendorMatchNames(tailor);
      if (orderMatchesTailor(order, matchNames)) {
        return res.json({ success: true, order });
      }
    }

    return res.status(404).json({ success: false, message: "Order not found" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    if (req.user.role === "admin") {
      order.status = status;
      await order.save();
      return res.json({ success: true, order });
    }

    if (req.user.role === "tailor") {
      const tailor = await User.findById(req.user.id).select("tailorProfile name").lean();
      const matchNames = tailorVendorMatchNames(tailor);
      if (!orderMatchesTailor(order, matchNames)) {
        return res.status(403).json({
          success: false,
          message: "You can only update orders that include your products",
        });
      }
      order.status = status;
      await order.save();
      return res.json({ success: true, order });
    }

    return res.status(403).json({ success: false, message: "Not authorized" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
