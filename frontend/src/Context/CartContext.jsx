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
            console.error("Failed to fetch cart", error);
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
                    price: price,
                    discountPercentage,
                    quantity: 1,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await fetchCart();
        } catch (error) {
            console.error("Add to cart failed", error);
        }
    };

    const removeFromCart = async (productId, price) => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            await axios.delete("http://localhost:3000/api/cart/remove", {
                headers: { Authorization: `Bearer ${token}` },
                data: { productId, price },
            });

            await fetchCart();
        } catch (error) {
            console.error("Remove failed", error);
        }
    };

    const updateQuantity = async (productId, price, quantity) => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            await axios.put(
                "http://localhost:3000/api/cart/update",
                { productId, price, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await fetchCart();
        } catch (error) {
            console.error("Update quantity failed", error);
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
            console.error("Clear cart failed", error);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getOriginalTotal = () => {
        return cartItems.reduce((total, item) => total + item.originalPrice * item.quantity, 0);
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
