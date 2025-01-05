import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = ({ url }) => {
  const printBill = (order) => {
    const printWindow = window.open("", "_blank");
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
            ${order.items.map(
              (item) => `<li>${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</li>`
            ).join("")}
          </ul>
          <p><strong>Total Amount: </strong>$${order.amount}</p>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/list");
    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: newStatus,
    });
    if (response.data.success) {
      fetchAllOrders();
      toast.success("Order status updated");
    } else {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "All") return true;
    return order.status === activeTab;
  });

  const closeModal = () => setSelectedOrder(null);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Orders</h3>
        <div className="flex space-x-2">
          {["All", "Processing", "Out for delivery", "Delivered"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded transition-colors duration-200 ${
                activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800"
              } hover:bg-green-500`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 text-white flex items-center justify-center rounded-full font-bold">
                  {order.address.firstName[0]}
                  {order.address.lastName[0]}
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-800">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Order #{order._id} / {order.type}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {new Date(order.date).toLocaleDateString()}
            </p>
            <div className="border-t mt-4 pt-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm mb-2">
                  <p>{item.name} x {item.quantity}</p>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-lg font-semibold text-gray-800">
                Total: ${order.amount.toFixed(2)}
              </p>
            </div>

            {/* Updated section for status */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedOrder(order)}
                >
                  See Details
                </button>
                <button
                  onClick={() => printBill(order)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  Print Bill
                </button>
                <div className="text-right">
                  {/* Refactored dropdown to handle status display */}
                  <select
                    className={`px-3 py-1 rounded-full text-sm focus:outline-none focus:ring ${
                      order.status === "Delivered"
                        ? "bg-green-600 text-white"
                        : order.status === "Out for delivery"
                        ? "bg-blue-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                  >
                    <option value="Processing">Processing</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for order details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-white p-8 rounded-lg w-full md:w-[50%] max-w-lg transition-transform transform scale-[1] md:scale-[1.05]">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p>
              <strong>Customer:</strong> {selectedOrder.address.firstName} {selectedOrder.address.lastName}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address.street}, {selectedOrder.address.city}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.address.phone}
            </p>
            <div className="mt-4">
              {selectedOrder.items.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <p>{item.name} x {item.quantity}</p>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
