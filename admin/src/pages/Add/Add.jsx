import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Salad',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', Number(data.price));
    formData.append('category', data.category);
    formData.append('image', image);

    const response = await axios.post(`${url}/api/food/add`, formData);

    if (response.data.success) {
      setData({
        name: '',
        description: '',
        price: '',
        category: 'Salad',
      });
      setImage(false);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form className="flex flex-col space-y-6" onSubmit={onSubmitHandler}>
        {/* Image Upload Section */}
        <div className="flex flex-col items-center space-y-2">
          <p className="text-lg font-semibold text-gray-700">Upload Image</p>
          <label htmlFor="image" className="cursor-pointer">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload"
              className="w-48 h-48 object-cover rounded-md border-2 border-gray-300 p-2"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        {/* Product Name */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600" htmlFor="name">
            Product name
          </label>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            className="px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Product Description */}
        <div className="flex flex-col">
          <label
            className="text-sm font-medium text-gray-600"
            htmlFor="description"
          >
            Product description
          </label>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
            className="px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Category and Price Section */}
        <div className="flex justify-between space-x-4">
          {/* Category Select */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium text-gray-600" htmlFor="category">
              Product category
            </label>
            <select
              onChange={onChangeHandler}
              name="category"
              className="px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          {/* Price Input */}
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium text-gray-600" htmlFor="price">
              Product price
            </label>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="$20"
              className="px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-6 py-3 mt-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
