import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);

    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error('Error');
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error('Error');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <p className="text-3xl font-extrabold text-center text-gray-900 mb-6">All Foods List</p>
      <div className="overflow-x-auto rounded-lg shadow-xl bg-white">
        <div className="grid grid-cols-5 gap-6 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-t-lg">
          <p className="text-sm">Image</p>
          <p className="text-sm">Name</p>
          <p className="text-sm">Category</p>
          <p className="text-sm">Price</p>
          <p className="text-sm">Action</p>
        </div>

        {list.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-6 px-8 py-4 border-b border-gray-200 hover:bg-gray-50 transition-all duration-300 ease-in-out rounded-b-lg"
          >
            <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={`${url}/images/${item.image}`}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-md font-medium text-gray-800">{item.name}</p>
            <p className="text-sm text-gray-600">{item.category}</p>
            <p className="text-sm text-gray-800 font-semibold">${item.price}</p>
            <p
              onClick={() => removeFood(item._id)}
              className="text-red-600 cursor-pointer hover:text-red-800 transition duration-300 ease-in-out text-sm"
            >
              Delete
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
