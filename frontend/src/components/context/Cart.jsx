import React, { useContext } from 'react';
import { StoreContext } from './StoreContext';

const Cart = () => {
    const { cartItems, removeFromCart, food_list, getTotalCartAmount, setCartItems } = useContext(StoreContext);

    const handleQuantityChange = (itemId, change) => {
        setCartItems((prev) => {
            const newCount = prev[itemId] + change;
            return newCount <= 0 ? { ...prev, [itemId]: 0 } : { ...prev, [itemId]: newCount };
        });
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
            {Object.keys(cartItems).length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
            ) : (
                Object.keys(cartItems).map((itemId) => {
                    const item = food_list.find((product) => product._id === itemId);
                    if (!item) return null;
                    return (
                        <div key={itemId} className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                <div>
                                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                    <p className="text-sm text-gray-500">${item.price} x {cartItems[itemId]}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleQuantityChange(itemId, -1)}
                                    className="bg-gray-300 text-gray-700 rounded-full px-3 py-1 hover:bg-gray-400"
                                >
                                    -
                                </button>
                                <span className="text-lg font-semibold">{cartItems[itemId]}</span>
                                <button
                                    onClick={() => handleQuantityChange(itemId, 1)}
                                    className="bg-gray-300 text-gray-700 rounded-full px-3 py-1 hover:bg-gray-400"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => removeFromCart(itemId)}
                                    className="bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-600 focus:outline-none ml-2"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
            <div className="border-t pt-4 mt-4">
                <p className="text-lg font-bold text-gray-800">Total: ${getTotalCartAmount()}</p>
            </div>
        </div>
    );
};

export default Cart;
