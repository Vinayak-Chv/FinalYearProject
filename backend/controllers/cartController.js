import Cart from "../models/cart.js";

const getUserId = (req) => {
  return req.user?.id || req.user?._id;
};

const normalizeProductId = (productId) => {
  if (!productId) return null;
  if (typeof productId === "object" && productId._id) {
    return productId._id.toString();
  }
  return productId.toString();
};

export const getCart = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user ID",
      });
    }

    let cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "title price images",
    );

    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    return res.json({ success: true, cart });
  } catch (error) {
    console.error("GET CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      productId,
      title,
      image,
      originalPrice,
      price,
      discountPercentage,
      quantity,
    } = req.body;

    const normalizedProductId = normalizeProductId(productId);

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingIndex = cart.items.findIndex(
      (item) => item.productId.toString() === normalizedProductId,
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: normalizedProductId,
        title,
        image,
        originalPrice,
        price,
        discountPercentage,
        quantity,
      });
    }

    await cart.save();

    return res.json({ success: true, cart });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { productId, quantity } = req.body;
    const normalizedProductId = normalizeProductId(productId);

    if (!normalizedProductId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === normalizedProductId,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    item.quantity = quantity;
    await cart.save();

    return res.json({ success: true, cart });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { productId } = req.body;
    const normalizedProductId = normalizeProductId(productId);

    if (!normalizedProductId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== normalizedProductId,
    );

    await cart.save();

    return res.json({ success: true, cart });
  } catch (error) {
    console.error("REMOVE ITEM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error("CLEAR CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
