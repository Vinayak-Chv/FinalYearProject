import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.get("http://localhost:3000/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCartItems(data?.cart?.items || []);
        } catch (error) {
            console.error("Failed to fetch cart:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (product, price, discountPercentage = 0) => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            await axios.post(
                "http://localhost:3000/api/cart/add",
                {
                    productId: product._id,
                    title: product.title,
                    image: product.images[0],
                    originalPrice: product.price,
                    price,
                    discountPercentage,
                    quantity: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            await fetchCart();
        } catch (error) {
            console.error("Add to cart failed:", error.response?.data || error.message);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            await axios.put(
                "http://localhost:3000/api/cart/update",
                { productId, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            await fetchCart();
        } catch (error) {
            console.error("Update quantity failed:", error.response?.data || error.message);
        }
    };

    const removeFromCart = async (productId) => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            await axios.delete("http://localhost:3000/api/cart/remove", {
                headers: { Authorization: `Bearer ${token}` },
                data: { productId },
            });

            await fetchCart();
        } catch (error) {
            console.error("Remove failed:", error.response?.data || error.message);
        }
    };

    const clearCart = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            await axios.delete("http://localhost:3000/api/cart/clear", {
                headers: { Authorization: `Bearer ${token}` },
            });

            await fetchCart();
        } catch (error) {
            console.error("Clear cart failed:", error.response?.data || error.message);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    const getOriginalTotal = () => {
        return cartItems.reduce(
            (total, item) => total + item.originalPrice * item.quantity,
            0
        );
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loading,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getOriginalTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
