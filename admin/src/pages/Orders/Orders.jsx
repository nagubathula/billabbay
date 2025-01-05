import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from './../../../../frontend/src/assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + '/api/order/list');
    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);
    } else {
      toast.error('Error');
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + '/api/order/status', {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      await fetchAllOrders();
    }
  };

  const printBill = (order) => {
    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>Order Bill</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .order-details { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Order Bill</h1>
          <h2>Order ID: ${order._id}</h2>
          <p><strong>Customer: </strong>${order.address.firstName} ${order.address.lastName}</p>
          <p><strong>Address: </strong>${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country} - ${order.address.zipcode}</p>
          <p><strong>Phone: </strong>${order.address.phone}</p>
          <h3>Items:</h3>
          <ul>
            ${order.items.map((item) => `<li>${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
          </ul>
          <p><strong>Total Amount: </strong>$${order.amount}</p>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const groupedOrders = orders.reduce(
    (acc, order) => {
      acc[order.status].push(order);
      return acc;
    },
    { 'Food Processing': [], 'Out for delivery': [], 'Delivered': [] }
  );

  return (
    <div className="container mx-auto p-6">
      <h3 className="text-2xl font-bold mb-6">Orders</h3>
      {Object.keys(groupedOrders).map((status) => (
        <div key={status} className="mb-8">
          <h4 className="text-xl font-semibold mb-4">{status}</h4>
          {groupedOrders[status].map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-lg p-6 mb-4 flex items-center">
              <img src={assets.parcel_icon} alt="" className="w-12 h-12 mr-4" />
              <div className="flex-1">
                <p className="text-lg font-medium">
                  {order.items.map((item, index) => `${item.name} x ${item.quantity}`).join(', ')}
                </p>
                <p className="text-gray-600">{order.address.firstName} {order.address.lastName}</p>
                <p className="text-gray-500">{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                <p className="text-gray-500">{order.address.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">${order.amount}</p>
                <select 
                  onChange={(event) => statusHandler(event, order._id)} 
                  value={order.status} 
                  className="border rounded p-2 mt-2">
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <button 
                  onClick={() => printBill(order)} 
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600">
                  Print Bill
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Orders;
