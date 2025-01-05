import React, { useContext } from 'react';
import { StoreContext } from './StoreContext';

const Checkout = () => {
    const { getTotalCartAmount } = useContext(StoreContext);

    const handleCheckout = () => {
        alert('Proceeding to checkout');
        // Add your checkout process here (e.g., redirect to payment page or API call)
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto mt-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-semibold">Order Summary</h2>
                <span className="text-gray-600 text-lg">Total: ${getTotalCartAmount()}</span>
            </div>
            <button
                onClick={handleCheckout}
                className="w-full bg-green-500 text-white py-3 rounded-lg text-lg hover:bg-green-600 focus:outline-none transition duration-200"
            >
                Checkout
            </button>
        </div>
    );
};

export default Checkout;
