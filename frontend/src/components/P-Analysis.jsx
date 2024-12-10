import React, { useState } from "react";
import axios from "axios";

export default function CentralProductAnalysis() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [message, setMessage] = useState("");

  const products = [
    { _id: '674833aea236ef407f30964c', name: 'Royal Dishwash 1 Litre' },
    { _id: '674833aea236ef407f30964d', name: 'Royal Dishwash 500 ml' },
    { _id: '674833aea236ef407f30964e', name: 'Royal Liquid Hand Wash 500 ml' },
    { _id: '674833aea236ef407f30964f', name: 'Royal Phenyl Liquid for Cleaning 5 Litre' },
    { _id: '674833aea236ef407f309650', name: 'Royal Phenyl Liquid for Cleaning 1 Litre' },
    { _id: '674833aea236ef407f309651', name: '2 Minutes Cleaning Acid 500 ml' },
    { _id: '674833aea236ef407f309652', name: '2 Minutes Cleaning Acid 1 Litre' },
    { _id: '674833aea236ef407f309653', name: '2 Minutes Cleaning Acid 5 Litre' },
    { _id: '674833aea236ef407f309654', name: '2 Minutes Cleaning Acid 35 Litre' },
    { _id: '674833aea236ef407f309655', name: 'Royal Disinfectant Toilet Cleaner 500 ml' },
    { _id: '674833aea236ef407f309656', name: 'Royal Disinfectant Toilet Cleaner 1 Litre' },
    { _id: '674833aea236ef407f309657', name: 'Royal Disinfectant Toilet Cleaner 35 Litre' },
    { _id: '674833f44b9e862422d4bca0', name: 'Royal Chilli Sauce 750 gm' },
    { _id: '674833f44b9e862422d4bca1', name: 'Royal Soya Sauce 200 gm' },
    { _id: '674833f44b9e862422d4bca2', name: 'Royal Soya Sauce 250 gm' },
    { _id: '674833f44b9e862422d4bca3', name: 'Royal Tomato Sauce 200 gm' },
    { _id: '674833f44b9e862422d4bca4', name: 'Royal Tomato Sauce 1 kg' },
    { _id: '674833f44b9e862422d4bca5', name: 'Royal Vinegar 750 ml' },
    { _id: '674833f44b9e862422d4bca6', name: 'Royal Vinegar 800 ml' },
    { _id: '674833f44b9e862422d4bca7', name: 'Royal Vinegar 500 ml' },
    { _id: '674833f44b9e862422d4bca8', name: 'Royal Vinegar 200 ml' },
    { _id: '674833f44b9e862422d4bca9', name: 'Royal Salad Oil 650 ml' },
    { _id: '674833f44b9e862422d4bcaa', name: 'Royal Salad Oil 500 ml' },
    { _id: '674833f6ca2124662d8ac991', name: 'Royal Chilli Sauce 750 gm' },
    { _id: '674833f6ca2124662d8ac992', name: 'Royal Soya Sauce 200 gm' },
    { _id: '674833f6ca2124662d8ac993', name: 'Royal Soya Sauce 250 gm' },
    { _id: '674833f6ca2124662d8ac994', name: 'Royal Tomato Sauce 200 gm' },
    { _id: '674833f6ca2124662d8ac995', name: 'Royal Tomato Sauce 1 kg' },
    { _id: '674833f6ca2124662d8ac996', name: 'Royal Vinegar 750 ml' },
    { _id: '674833f6ca2124662d8ac997', name: 'Royal Vinegar 800 ml' },
    { _id: '674833f6ca2124662d8ac998', name: 'Royal Vinegar 500 ml' },
    { _id: '674833f6ca2124662d8ac999', name: 'Royal Vinegar 200 ml' },
    { _id: '674833f6ca2124662d8ac99a', name: 'Royal Salad Oil 650 ml' },
    { _id: '674833f6ca2124662d8ac99b', name: 'Royal Salad Oil 500 ml' },
    { _id: '6748341b682b9572b466248c', name: 'Royal Omum Water 700 ml' },
    { _id: '6748341b682b9572b466248d', name: 'Royal Rose Water 700 ml' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      setMessage("Please select a product.");
      return;
    }

    window.location.href=`./product-analysis?PID=${selectedProduct}`
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 border border-gray-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Product Analysis</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">Select Product</label>
              <select
                name="productSelect"
                id="productSelect"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Please select</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              Submit
            </button>
          </form>

          {message && <p className="mt-4 text-center text-gray-900">{message}</p>}
        </div>
        <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center fixed bottom-5 right-5 hover:cursor-pointer" onClick={e=>window.location.href="./"}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2d2d2d">
                    <path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z"/>
                </svg>
            </div>
      </div>
    </>
  );
}
