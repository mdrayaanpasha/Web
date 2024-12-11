import axios from "axios";
import { useEffect, useState } from "react";
import Button from "./button";
import Toast from "./toast";
import { jsPDF } from "jspdf";  // Import jsPDF for PDF generation

import Nav from "./Nav"

export default function BillInt() {
  const [Products, setProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [CustomerDetails, setCustomerDetails] = useState(null);
  const [addedProducts, setAddedProducts] = useState([]);
  const [userMobile, setUserMobile] = useState(""); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [creditAmount, setCreditAmount] = useState(0);


  // GST state and total amount
  const [gstRate, setGstRate] = useState(18);
  const [totalAmount, setTotalAmount] = useState(0);

  

  const triggerToast = (message) => {
    setToastMessage(message); 
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  const fetchAllProducts = async () => {
    try {
      const resp = await axios.get("https://royalco-api.onrender.com/api/getAllProduct");
      if (resp.status === 200) {
        setProducts(resp.data.Data || []);
      } else {
        alert(`Unexpected response: ${resp.status}`);
      }
    } catch (e) {
      console.log(e.message);
      alert(e.response?.status || "Network error");
    }
  };

  useEffect(() => {
    
    if(isAuthenticated){
      fetchAllProducts();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    calculateTotal();
  }, [addedProducts]);

  const calculateGST = (price, quantity) => {
    return (price * quantity * gstRate) / 100;
  };

  const calculateTotal = () => {
    let newTotal = 0;
    addedProducts.forEach(product => {
      const productTotal = product.price * product.quantity;
      const gstAmount = calculateGST(product.price, product.quantity);
      newTotal += productTotal + gstAmount;
    });
    setTotalAmount(newTotal);
  };

  const handleAddProduct = () => {
    if (selectedProduct && price) {
      setAddedProducts((prev) => [
        ...prev,
        { ...selectedProduct, price: parseFloat(price), quantity },
      ]);
      setPrice(""); 
      setQuantity(1); 
      setIsDialogOpen(false); 
    } else {
      alert("Please select a product, enter a price and set a quantity");
    }
  };

  const handleDeleteProduct = (index) => {
    setAddedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const authenticateUser = async () => {
    if (userMobile.length === 10) { 
      try {
        const resp = await axios.post("https://royalco-api.onrender.com/api/billAuth", { Phone: userMobile });
        if (resp.status === 200) {
          setIsAuthenticated(true);

          setCustomerDetails(resp.data.Data);
          triggerToast('😃 User Identified!');
        } 
      } catch (error) {
        if(error.response.status === 402){
          alert("🥹 User Doesn't Exist!")
          window.location.href="./userAdd"
        }else{
          triggerToast('Error occurred: ',error.response.status);
          console.log(error);
        }
      
      }
    } else {
      alert("Please enter a valid mobile number.");
    }
  };

  // PDF Generation Function
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Use a modern font (Helvetica)
    doc.setFont('helvetica', 'normal');
  
    // Company Details - Centered and Professional
    doc.setFontSize(22);  // Larger font size for company name
    const companyName = "Royal and Co";
    const companyNameWidth = doc.getStringUnitWidth(companyName) * doc.getFontSize() / doc.internal.scaleFactor;
    const centerX = (doc.internal.pageSize.width - companyNameWidth) / 2;
    doc.text(companyName, centerX, 20);
  
    // Address Details
    doc.setFontSize(12);
    const address = [
      "FMCG Manufacturer in Bengaluru, Karnataka",
      "Address: 23, Wellington St, Richmond Town,",
      "Bengaluru, Karnataka 560025"
    ];
    
    address.forEach((line, index) => {
      const lineWidth = doc.getStringUnitWidth(line) * doc.getFontSize() / doc.internal.scaleFactor;
      const lineCenterX = (doc.internal.pageSize.width - lineWidth) / 2;
      doc.text(line, lineCenterX, 25 + index * 5);
    });
  
    // Separator Line
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);  // Black color
    doc.line(14, 40, 200, 40);  // Horizontal line
    
    // Invoice Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("Invoice", 160, 45);
  
    // Customer Details Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Customer: ${CustomerDetails[0].Name}`, 14, 60);
    doc.text(`Phone: ${CustomerDetails[0].Phone}`, 14, 65);
    doc.text(`Email: ${CustomerDetails[0].Email}`, 14, 70);
    
    // Line Separator
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 75, 200, 75);
  
    // Product Table Header
    let y = 80;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Product', 14, y);
    doc.text('Quantity', 90, y);
    doc.text('Price (unit)', 130, y);
    doc.text('GST', 160, y);
    doc.text('Total', 190, y);
    
    // Line separator after table header
    doc.setLineWidth(0.5);
    doc.line(14, y + 5, 200, y + 5);
  
    // Product Details in the table
    y += 10;
    let netAmount = 0;
    addedProducts.forEach((product) => {
      const productTotal = product.price * product.quantity;
      const gstAmount = calculateGST(product.price, product.quantity);
      const totalAmount = productTotal + gstAmount;
      
      doc.setFont('helvetica', 'normal');
      doc.text(product.name, 14, y);
      doc.text(String(product.quantity), 90, y);
      doc.text(product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 130, y);
      doc.text(gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 160, y);
      doc.text(totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 190, y);
      
      y += 10;
      netAmount += productTotal;
    });
    
    // Line separator after product list
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, y + 5, 200, y + 5);
    
    // Calculate Gross Amount and GST
    const totalGST = addedProducts.reduce((acc, product) => acc + calculateGST(product.price, product.quantity), 0);
    const grossAmount = netAmount + totalGST;
  
    // Add Totals Section
    y += 15;
    doc.setFont('helvetica', 'bold');
    doc.text('Gross Amount', 100, y);
    doc.text(netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 160, y);
  
    y += 7;
    doc.text('Total GST', 100, y);
    doc.text(totalGST.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 160, y);
  
    y += 7;
    doc.text('Net Amount', 100, y);
    doc.text(grossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 160, y);
  
    // Add Credit Section
    if (creditAmount > 0) {
      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.text('Credit Amount', 100, y);
      doc.text(creditAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 160, y);
      
      y += 7;
      const remainingAmount = grossAmount - creditAmount;
      doc.text('Paid Amount', 100, y);
      doc.text(remainingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 160, y);
    }
  
    // Line separator for totals
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(14, y + 10, 200, y + 10);
  
  
    // Footer Section
    y += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("Thank you for your business!", 14, y);
    y += 5;
    doc.text("For inquiries, contact: +91 123 456 7890 | support@royalandco.com", 14, y);
    doc.text("www.royalandco.com", 14, y + 10);
  
    // Save the PDF
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    doc.save(`RC-Invoice-${timestamp}.pdf`); 
  };


  //now one last thing:
  /*
    Create API Connection where send Add Product in a nice way.
    With Credit Amount.
  */

    const FinalAPI = async()=>{
      try {
        const resp = await axios.post("https://royalco-api.onrender.com/api/FinalTransactionApi",{Products:addedProducts,CreditAmount:creditAmount,CustomerDetails:CustomerDetails[0]});
        if(resp.status === 200){
          triggerToast('😀 Bill Successfull!');
          setTimeout(function() {
            window.location.href = "/";  
        }, 3000);
        }
      } catch (error) {
        console.log(error)
        triggerToast('😥 Internal Server Error!');
      }
    }

  
  

  return (
    <>
      {showToast && <Toast message={toastMessage} />}
      
      <Nav></Nav>

      <main className="flex flex-col items-center justify-center mt-4">
        {!isAuthenticated ? (
          <div className="w-3/4 mb-4">
            <h2 className="text-lg text-gray-800 font-bold mb-2 px-3 py-3  bg-gray-100 rounded-lg ">Customer Authentication</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Enter Customers mobile number:
              </label>
              <input
                type="text"
                value={userMobile}
                onChange={(e) => setUserMobile(e.target.value)}
                className="border rounded w-full py-2 px-3"
                placeholder="Enter mobile number"
              />
            </div>
            <Button label="Authenticate" onClick={authenticateUser} />
          </div>
        ) : (
          <>
            <Button label="Add Product" onClick={() => setIsDialogOpen(true)} />
            <button
              onClick={()=>{
                generatePDF();
                FinalAPI();
              }}
              className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white py-3 px-6 rounded-full text-lg shadow-lg hover:bg-gray-800 transition duration-300"
            >
              Generate Bill (PDF) 🎉
            </button>
            
            {/* Display Added Products */}
            <div className="mt-4 w-3/4">
              <h2 className="text-lg font-semibold mb-2">Added Products:</h2>
              {addedProducts.length > 0 ? (
                <ul className="border border-gray-200 rounded p-4 bg-white">
                  {addedProducts.map((product, index) => (
                    <li key={index} className="flex justify-between py-2 px-2 border-b last:border-none">
                      <span>{product.name}</span>
                      <span>₹{product.price.toFixed(2)} x {product.quantity}</span>
                      <span>GST: ₹{calculateGST(product.price, product.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => handleDeleteProduct(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No products added yet.</p>
              )}
            </div>

            {/* Display Total */}
            <div className="mt-4 w-3/4">
              <h2 className="text-lg font-semibold mb-2">Total Amount:</h2>
              <p>₹{totalAmount.toFixed(2)}</p>
            </div>

            <div className="mt-4 w-3/4">
            <h2 className="text-lg font-semibold mb-2">Add Credit (₹):</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Enter Credit Amount:</label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(Number(e.target.value))}
                className="border rounded w-full py-2 px-3"
                placeholder="Enter amount"
                min="0"
              />
            </div>
          </div>
          </>
        )}
        <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center fixed bottom-5 right-5 hover:cursor-pointer" onClick={e=>window.location.href="./"}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2d2d2d">
                    <path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z"/>
                </svg>
            </div>
      </main>
      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Product</h3>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Select Product
              </label>
              <select
                value={selectedProduct ? selectedProduct.name : ""}
                onChange={(e) =>
                  setSelectedProduct(
                    Products.find((product) => product.name === e.target.value)
                  )
                }
                className="border rounded w-full py-2 px-3"
              >
                <option value="">Select Product</option>
                {Products.map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border rounded w-full py-2 px-3"
                placeholder="Enter price"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded w-full py-2 px-3"
                min="1"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                label="Cancel"
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-400 text-white"
              />
              <Button label="Add" onClick={handleAddProduct} />
            </div>
          </div>

          
        </div>
      )}
    </>
  );
}
