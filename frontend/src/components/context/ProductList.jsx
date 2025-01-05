import React, { useContext } from 'react';
import { StoreContext } from './StoreContext';

const ProductList = () => {
    const { food_list, addToCart } = useContext(StoreContext);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {food_list.map((food) => (
                <div key={food._id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-xl">
                    <img src={food.image} alt={food.name} className="w-full h-48 object-cover rounded-t-xl" />
                    <div className="p-6">
                        <h3 className="text-2xl font-semibold text-gray-800">{food.name}</h3>
                        <p className="text-gray-500 text-sm mt-2">{food.description}</p>
                        <div className="flex justify-between items-center mt-4">
                            <p className="text-lg font-semibold text-teal-600">${food.price}</p>
                            <button
                                onClick={() => addToCart(food._id)}
                                className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition duration-200"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
