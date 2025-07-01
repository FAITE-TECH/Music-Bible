import { useLocation } from "react-router-dom";
import { useState } from "react";
import PayButton from "../Components/PayButton";

export default function OrderSummary() {
  const location = useLocation();
  const musicItem = location.state?.musicItem;
  const [price, setPrice] = useState(0);

  const handlePriceChange = (e) => {
    const inputPrice = parseInt(e.target.value);
    if (!isNaN(inputPrice) && inputPrice >= 0) {
      setPrice(inputPrice);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-gray-300">
            Review your order details before proceeding to payment
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Order Item Section */}
          <div className=" rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-300 mb-6 pb-2 border-b border-gray-400">
                Your Selection
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 items-center p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                <img
                  className="w-32 h-32 rounded-lg object-cover shadow-sm"
                  src={musicItem.image}
                  alt={musicItem.title}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">
                    {musicItem.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">Quantity: 1</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-400">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Item Price</span>
                  <span className="font-medium">${price}</span>
                </div>

                <div className="pt-4">
                  <label
                    htmlFor="customPrice"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Custom Donation Amount
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="customPrice"
                      min="0"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 py-2 sm:text-sm border-gray-400 rounded-md"
                      placeholder="0"
                      value={price}
                      onChange={handlePriceChange}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <span className="text-gray-500 sm:text-sm pr-3">USD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Section */}
              <div className="mt-8 pt-6 border-t border-gray-400">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-800">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${price}
                  </span>
                </div>

                <div className="mt-6 flex justify-center">
                  <PayButton music={musicItem} price={price} />
                </div>

                <p className="mt-4 text-xs text-gray-500 text-center">
                  By completing your purchase, you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>

          

        </div>
      </div>

      
    </div>
  );
}
