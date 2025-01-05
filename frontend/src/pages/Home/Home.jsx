import React, { useState } from "react";

import ProductList from "../../components/context/ProductList";
import Cart from "../../components/context/Cart";
import Checkout from "../../components/context/Checkout";

const Home = () => {
  const [category, setCategory] = useState("All");
  return (
    <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Restaurant POS System</h1>
    <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex-1">
            <ProductList />
        </div>
        <div className="w-full lg:w-80">
            <Cart />
        </div>
    </div>
    <Checkout />
</div>
  );
};

export default Home;
