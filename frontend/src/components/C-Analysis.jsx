import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CentralCustomerAnalysis() {
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [error, setError] = useState('');
  const [redir,setRedir]=useState(false)



  useEffect(()=>{
    if(redir && customerMobile){
        window.location.href=`./customer-analysis?CN=${customerMobile}`
    }
  },[redir])

  const GetCustomerInfo = async()=>{
    try {
        const response = await axios.post("http://localhost:5000/api/CustomerCheck",{CN:customerName,CM:customerMobile})
        console.log(response.data)
        if(response.status === 200){
            setCustomerMobile(response.data.number)
            setRedir(true)
        }
    } catch (error) {
        if(error.status === 404){
            setError("User Not Found Try With Number if you didnt already!")
        }
        console.log(error)
        
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!customerName && !customerMobile) {
      setError('Please fill in either Customer Name or Customer Mobile.');
    } else {
        const CustomerInfo = GetCustomerInfo()
    }
  };

  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-white text-black">
      <div className="w-full max-w-md p-6 border border-black rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Customer Information</h2>
        <form onSubmit={handleSubmit}>
          {/* Customer Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded-lg bg-white text-black focus:outline-none focus:border-gray-600"
              placeholder="Enter Customer Name"
            />
          </div>

          {/* Customer Mobile Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Customer Mobile</label>
            <input
              type="text"
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded-lg bg-white text-black focus:outline-none focus:border-gray-600"
              placeholder="Enter Customer Mobile"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm mb-4">{error}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
