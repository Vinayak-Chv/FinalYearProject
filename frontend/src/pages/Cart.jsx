import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, loading } = useCart();
  const total = getCartTotal();

  if (loading) {
    return <div className="py-8 text-center">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="py-8 text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-4">Your Cart</h1>
        <p className="text-text-secondary">Cart is empty. Start shopping!</p>
        <Link to="/collection" className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded">
          Browse Collection
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(item.productId, item.price, newQuantity);
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-6">Your Cart</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left">Sr No.</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Subtotal</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={`${item.productId}-${item.price}`} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="px-4 py-2 font-semibold">{item.title}</td>
                <td className="px-4 py-2">₹{item.price}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <FiMinus />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2">₹{item.price * item.quantity}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => removeFromCart(item.productId, item.price)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-end">
        <div className="bg-gray-50 p-4 rounded-lg w-64">
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₹{total}</span>
          </div>
          <button className="w-full bg-primary text-white py-2 rounded mt-4 hover:bg-primary-dark">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;