import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from './../../../../frontend/src/assets/assets';

const Orders2 = ({ url }) => {
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
    <div className="order-list">
      <h3>Orders</h3>
      {Object.keys(groupedOrders).map((status) => (
        <div key={status} className="order-group">
          <h4>{status}</h4>
          {groupedOrders[status].map((order) => (
            <div key={order._id} className="order-item">
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, index) => `${item.name} x ${item.quantity}`).join(', ')}
                </p>
                <p className="order-item-name">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>${order.amount}</p>
              <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button onClick={() => printBill(order)}>Print Bill</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Orders2;
