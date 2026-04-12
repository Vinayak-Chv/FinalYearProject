import Cart from "../models/Cart.js";
import Product from "../models/product.js";

const getUserId = (req) => {
  return req.user?.id || req.user?._id;
};

export const getCart = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No user ID" });
    }

    let cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "title price images",
    );

    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    res.json({ success: true, cart });
  } catch (error) {
    console.error("❌ GET CART ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const {
      productId,
      title,
      image,
      originalPrice,
      price,
      discountPercentage,
      quantity,
    } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.price === price,
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        title,
        image,
        originalPrice,
        price,
        discountPercentage,
        quantity,
      });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    console.error("❌ ADD TO CART ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { productId, price, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.productId.toString() === productId && i.price === price,
    );

    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    item.quantity = quantity;

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    console.error("❌ UPDATE CART ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const { productId, price } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => !(i.productId.toString() === productId && i.price === price),
    );

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    console.error("❌ REMOVE ITEM ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.error("❌ CLEAR CART ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
