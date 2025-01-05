import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-100 flex flex-col p-6">
      {/* Sidebar Header (optional) */}

      {/* Sidebar Options */}
      <div className="space-y-4">
        <NavLink
          to="/add"
          className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-200 transition-all duration-200"
          activeClassName="bg-gray-600"
        >
          <p className="text-lg">Add Items</p>
        </NavLink>

        <NavLink
          to="/list"
          className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-200 transition-all duration-200"
          activeClassName="bg-gray-600"
        >
          <p className="text-lg">List Items</p>
        </NavLink>

        <NavLink
          to="/orders"
          className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-200 transition-all duration-200"
          activeClassName="bg-gray-600"
        >
          <p className="text-lg">Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
