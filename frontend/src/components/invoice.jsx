import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../assets/imgs/logo.jpeg";

const Invoice = () => {
  const [invoiceId, setInvoiceId] = useState(null);
  const [data, setData] = useState(null);
  const [customerData, setCustomerData] = useState(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");

  // Utility function to format numbers in Indian format
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(num);
  };

  // Fetch transaction details
  async function fetchData(id) {
    try {
      const resp = await axios.post("https://royalco-api.onrender.com/api/getTransactionsById", { Id: id });
      setData(resp.data.D);
      await fetchCustomer(resp.data.D.CID); // Fetch customer data based on customer ID
      console.log(resp.data.D);
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch customer details by customer ID
  async function fetchCustomer(id) {
    try {
      const resp = await axios.post("https://royalco-api.onrender.com/api/getCustomerById", { Id: id });
      setCustomerData(resp.data.D);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (id) {
      setInvoiceId(id);
      fetchData(id);
    }
  }, [id]);

  // Calculate the total CGST for the invoice
  const calculateTotalCGST = () => {
    let totalCGST = 0;
    data?.ProductList.forEach((product) => {
      const gstAmount = product.ProductPrice * product.Unit * (product.GST / 100);
      const cgstAmount = gstAmount / 2;
      totalCGST += cgstAmount;
    });
    return totalCGST.toFixed(2);
  };

  // Calculate the total SGST for the invoice
  const calculateTotalSGST = () => {
    let totalSGST = 0;
    data?.ProductList.forEach((product) => {
      const gstAmount = product.ProductPrice * product.Unit * (product.GST / 100);
      const sgstAmount = gstAmount / 2;
      totalSGST += sgstAmount;
    });
    return totalSGST.toFixed(2);
  };

  // Calculate the Gross Amount
  const calculateGrossAmount = () => {
    const totalCGST = calculateTotalCGST();
    const totalSGST = calculateTotalSGST();
    return (data.NetAmt - totalCGST - totalSGST).toFixed(2);
  };

  return (
    <div className="p-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-center mb-6 space-x-4">
        <img src={logo} alt="Royal and Co Logo" className="w-32" />
        <div className="text-center">
          <h1 className="text-3xl font-bold">Royal and Co</h1>
          <p className="text-sm">FMCG Manufacturer in Bengaluru, Karnataka</p>
          <p className="text-xs">
            Address: 23, Wellington St, Richmond Town, Bengaluru, Karnataka 560025
          </p>
        </div>
      </div>
      <hr />
      <style>
        {`
        @media print {
          @page {
              margin: 0; /* Removes the default header and footer margins */
          }
          body {
              margin: 1cm; /* Adds a custom margin to ensure content is not clipped */
          }
        }
        `}
      </style>

      {/* Invoice Section */}
      <h2 className="text-2xl font-bold mb-4 text-center mt-8">Invoice Details</h2>

      {data ? (
        <>
          <div className="flex justify-between mb-4">
            <p className="font-semibold text-black">Invoice ID: <span className="font-normal text-gray-600">{data.TID}</span></p>
            <p className="font-semibold text-black">Date: <span className="font-normal text-gray-600">{data.D}/{data.M}/{data.Y}</span></p>
          </div>

          {/* Customer Information */}
          {customerData && (
            <div className="p-4 rounded mb-4 flex flex-col justify-center">
              <h2 className="text-xl font-semibold mb-3 ">Customer Information</h2>
              <div className="flex flex-wrap space-x-8">
                <div className="flex items-center">
                  <h3 className="font-semibold text-base mr-2">Name:</h3>
                  <p className="text-gray-700 text-sm">{customerData.Name}</p>
                </div>

                {/* GST Number */}
                <div className="flex items-center">
                  <h3 className="font-semibold text-base text-yellow-600 mr-2">GST Number:</h3>
                  <p className="text-yellow-600 text-sm">{customerData.GST_NUM}</p>
                </div>
              </div>
            </div>
          )}

          {/* Invoice Table */}
          <table className="min-w-full table-auto border-collapse border border-gray-300 mb-6 border rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-sm">
                <th className="border border-gray-300 p-2">Product Name</th>
                <th className="border border-gray-300 p-2">HSN</th>

                <th className="border border-gray-300 p-2">Price</th>
                <th className="border border-gray-300 p-2">Unit</th>
                <th className="border border-gray-300 p-2">CGST</th>
                <th className="border border-gray-300 p-2">SGST</th>
                <th className="border border-gray-300 p-2">Total GST</th>
                <th className="border border-gray-300 p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.ProductList.map((product, index) => {
                const gstAmount = product.ProductPrice * product.Unit * (product.GST / 100);
                const cgstAmount = gstAmount / 2;
                const sgstAmount = gstAmount / 2;
                const totalAmount = product.ProductPrice * product.Unit + gstAmount;

                return (
                  <tr key={index} className="hover:bg-gray-100 text-sm">
                    <td className="border border-gray-300 p-2">{product.ProductName}</td>
                    <td className="border border-gray-300 p-2">{product.HSN}</td>

                    <td className="border border-gray-300 p-2">{formatNumber(product.ProductPrice)}</td>
                    <td className="border border-gray-300 p-2">{formatNumber(product.Unit)}</td>
                    <td className="border border-gray-300 p-2">{formatNumber(cgstAmount)}</td>
                    <td className="border border-gray-300 p-2">{formatNumber(sgstAmount)}</td>
                    <td className="border border-gray-300 p-2">{formatNumber(product.GST)}%</td>
                    <td className="border border-gray-300 p-2">{formatNumber(totalAmount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="fixed bottom-5 right-10">
            <button className="bg-black text-white p-3 rounded-3xl px-5" onClick={e=>print()}>Print Bill</button>
          </div>

          {/* Summary Section */}
          <div className="mt-6 p-4 flex items-end justify-center flex-col">
            <p><strong>Gross Amount: </strong><span className="text-gray-500">{formatNumber(calculateGrossAmount())}</span></p>
            <p><strong>Total CGST: </strong><span className="text-gray-500">{formatNumber(calculateTotalCGST())}</span></p>
            <p><strong>Total SGST: </strong><span className="text-gray-500">{formatNumber(calculateTotalSGST())}</span></p>
            <p><strong>Net Amount: </strong><span className="text-gray-500">{formatNumber(data.NetAmt)}</span></p>
            <p><strong>Credit Amount: </strong><span className="text-gray-500">{formatNumber(data.NetAmt)}</span></p>
          </div>

          {/* Company Bank Details */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 ">Company Bank Details</h2>
            <div className="flex items-center justify-evenly">
              <div>
                <p className="text-gray-600 font-small">Bank Name</p>
                <p className="text-gray-800 text-sm">AXIS BANK LTD</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Account Number</p>
                <p className="text-gray-800 text-sm">923020000708063</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Branch & IFSC</p>
                <p className="text-gray-800 text-sm">JC ROAD, BANGALORE 560002 - UTIBO001688</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    
  );
};

export default Invoice;
