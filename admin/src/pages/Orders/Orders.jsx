import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from './../../../../frontend/src/assets/assets';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .order-details {
              margin-bottom: 20px;
            }
            .order-item-food, .order-item-name, .order-item-address, .order-item-phone {
              margin: 5px 0;
            }
            .order-items {
              margin-bottom: 15px;
            }
          </style>
        </head>
        <body>
          <h1>Order Bill</h1>
          <div class="order-details">
            <h2>Order ID: ${order._id}</h2>
            <p><strong>Customer: </strong>${order.address.firstName} ${order.address.lastName}</p>
            <p><strong>Address: </strong>${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country} - ${order.address.zipcode}</p>
            <p><strong>Phone: </strong>${order.address.phone}</p>
          </div>
          <div class="order-items">
            <h3>Items:</h3>
            <ul>
              ${order.items
                .map(
                  (item) =>
                    `<li>${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(
                      2
                    )}</li>`
                )
                .join('')}
            </ul>
          </div>
          <div class="order-total">
            <p><strong>Total Amount: </strong>$${order.amount}</p>
          </div>
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

  // Group orders by status
  const groupOrdersByStatus = () => {
    return orders.reduce(
      (acc, order) => {
        acc[order.status].push(order);
        return acc;
      },
      {
        'Food Processing': [],
        'Out for delivery': [],
        'Delivered': [],
      }
    );
  };

  // Handle drag end event
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If dropped outside the list, do nothing
    if (!destination) return;

    // If dropped in the same list and position, do nothing
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Update order status after drag
    const orderId = draggableId;
    const newStatus = destination.droppableId;

    // Update order status in backend
    const updateOrderStatus = async () => {
      const response = await axios.post(url + '/api/order/status', {
        orderId,
        status: newStatus,
      });

      if (response.data.success) {
        fetchAllOrders();
      } else {
        toast.error('Failed to update order status');
      }
    };

    updateOrderStatus();
  };

  const groupedOrders = groupOrdersByStatus();

  return (
    <div className="order add">
      <h3>Order Kanban Board</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-container">
          {/* Food Processing Column */}
          <Droppable droppableId="Food Processing">
            {(provided) => (
              <div
                className="kanban-column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h4>Food Processing</h4>
                {groupedOrders['Food Processing'].map((order, index) => (
                  <Draggable key={order._id} draggableId={order._id} index={index}>
                    {(provided) => (
                      <div
                        className="order-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <img src={assets.parcel_icon} alt="" />
                        <div>
                          <p className="order-item-food">
                            {order.items.map((item, index) => {
                              if (index === order.items.length - 1) {
                                return item.name + ' x ' + item.quantity;
                              } else {
                                return item.name + ' x ' + item.quantity + ' , ';
                              }
                            })}
                          </p>
                          <p className="order-item-name">
                            {order.address.firstName + ' ' + order.address.lastName}
                          </p>
                          <div className="order-item-address">
                            <p>{order.address.state + ','}</p>
                            <p>
                              {order.address.city +
                                ' ,' +
                                order.address.state +
                                ' ,' +
                                order.address.country +
                                ' ,' +
                                order.address.zipcode}
                            </p>
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
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Out for Delivery Column */}
          <Droppable droppableId="Out for delivery">
            {(provided) => (
              <div
                className="kanban-column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h4>Out for delivery</h4>
                {groupedOrders['Out for delivery'].map((order, index) => (
                  <Draggable key={order._id} draggableId={order._id} index={index}>
                    {(provided) => (
                      <div
                        className="order-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <img src={assets.parcel_icon} alt="" />
                        <div>
                          <p className="order-item-food">
                            {order.items.map((item, index) => {
                              if (index === order.items.length - 1) {
                                return item.name + ' x ' + item.quantity;
                              } else {
                                return item.name + ' x ' + item.quantity + ' , ';
                              }
                            })}
                          </p>
                          <p className="order-item-name">
                            {order.address.firstName + ' ' + order.address.lastName}
                          </p>
                          <div className="order-item-address">
                            <p>{order.address.state + ','}</p>
                            <p>
                              {order.address.city +
                                ' ,' +
                                order.address.state +
                                ' ,' +
                                order.address.country +
                                ' ,' +
                                order.address.zipcode}
                            </p>
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
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Delivered Column */}
          <Droppable droppableId="Delivered">
            {(provided) => (
              <div
                className="kanban-column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h4>Delivered</h4>
                {groupedOrders['Delivered'].map((order, index) => (
                  <Draggable key={order._id} draggableId={order._id} index={index}>
                    {(provided) => (
                      <div
                        className="order-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <img src={assets.parcel_icon} alt="" />
                        <div>
                          <p className="order-item-food">
                            {order.items.map((item, index) => {
                              if (index === order.items.length - 1) {
                                return item.name + ' x ' + item.quantity;
                              } else {
                                return item.name + ' x ' + item.quantity + ' , ';
                              }
                            })}
                          </p>
                          <p className="order-item-name">
                            {order.address.firstName + ' ' + order.address.lastName}
                          </p>
                          <div className="order-item-address">
                            <p>{order.address.state + ','}</p>
                            <p>
                              {order.address.city +
                                ' ,' +
                                order.address.state +
                                ' ,' +
                                order.address.country +
                                ' ,' +
                                order.address.zipcode}
                            </p>
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
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Orders;
 