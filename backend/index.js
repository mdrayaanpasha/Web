import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 5000;

// MongoDB URI for Mongoose
const uri = "mongodb+srv://Admin101:K_HpGC_ZweZD2h2@webroyalco.oaatc.mongodb.net/WebRoyalCo?retryWrites=true&w=majority&appName=WebRoyalCo";
// Connect Mongoose to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

  .then(() => {
    console.log("Successfully connected to MongoDB using Mongoose");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// MongoDB Models
import ProductModel from './models/productModel.js';
import CustomerModel from "./models/customerModel.js"
import transactionModel from './models/transactionModel.js';
// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define a simple route
app.get('/', (req, res) => {
  res.send('Welcome to the Backend API');
});

// Handle Add Product API
app.post("/api/addProduct", async (req, res) => {
  console.log(req.body.Data); // Log the request body for debugging
  try {
    const newProduct = await ProductModel.create(req.body.Data);
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product", error });
  }
});


/*

#Route:
- GET: api/getAllProducts.

# Purpose:
- Fetch All Products.
- Used in Billing Page.

*/


app.get("/api/getAllProduct",async(req,res)=>{
  try {
     const data = await ProductModel.find();
     const augmentedData=[]
     for (const ele of data){
      augmentedData.push(
        {
          _id:ele._id,
          name:ele.name,
          GST_RATE:ele.GST_RATE
        }
    )
     }

     res.status(200).json({Data:augmentedData,success:true})
  } catch (error) {
    console.log(error)
    res.status(500).json({Message:"Internal Server Error",success:false})
  }
})



app.post("/api/auth", async (req, res) => {
  const ClientData = req.body;
  
  try {
    // Check if the user with this phone number already exists
    const data = await CustomerModel.find({ Phone: ClientData.Phone });

    if (data.length > 0) {
      // If user exists, send an error response
      return res.status(402).json({ message: "User already exists" });
    } else {
      // If no user exists, register the new user
      await CustomerModel.create({
        Name: ClientData.Name,
        Email: ClientData.Email,
        Phone: ClientData.Phone,
        Purchase_History: [],
      });
      
      // Respond with success
      return res.status(200).json({ message: "User created successfully", success: true });
    }
  } catch (error) {
    // Log error and respond with a server error
    console.log(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});


app.post("/api/billAuth",async(req,res)=>{
  const ClientData = req.body
  try {
    const data = await CustomerModel.find({Phone:ClientData.Phone})
    const augmentedData = []

    for (const ele of data){
      augmentedData.push({
        _id:ele._id,
        Name: ele.Name,
        Email:ele.Email,
        Phone: ele.Phone
      })
    }
    if(data.length > 0){
      res.status(200).json({success:true,Data:augmentedData})
    }else{
      res.status(402).json({success:false,message:"User Doesn't Exist!"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({success:false,message:"internal server error"})
  }
})




/*
- POST: api/getAllProducts.

#INPUT:
  - Products -> Array of products.
  - CustomerDetails -> Dict of Costumer Details.
    {
      _id:'',
      Name:'',
      Email: '',
      Phone: ''
    }
  - CreditAmount -> Credit Customer Entailed.


  # Purpose:

    + Task 1: Add Data in Transaction Model With Credit Check:
          {
            CID: String,
            NetAmt: Number,
            Y: Number,
            M: Number,
            ProductList: [
                {
                    PID: String,
                    Unit: Number,
                }
            ],
            Credit:Number
          }
    + Task 2: Update Customer Data By Appending This Transaction 
              Their history, like this:
              Purchase_History: [
                {
                    Year: Number,
                    Month: Number,
                    Products: [
                        {
                            PID: String,
                            Units: Number,
                        }
                    ]
                }
              ],
    + Task 3: Update ProductModel By Appending This To Sale_history.
              Sale_history: [
                  {
                      Year: Number,
                      Month: Number,
                      Units: Number,
                  }
              ],
              & Last_Sold: TimeStamp of today.
              also reduce the stock thing.



 
*/
app.post("/api/FinalTransactionApi",async(req,res)=>{
  const ClientData = req.body;
  let TotalCost = 0
  const today = new Date()
  let products = []

  for(let product of ClientData.Products){

    const GST_RATE = parseInt(product.GST_RATE.replace('%', ''), 10);
    const price = product.price * product.quantity

    const GST = price * (GST_RATE / 100);
    
    TotalCost+=price + GST;
    products.push({PID:product._id,Unit:product.quantity})
    

 

  }



  //holds data to be stored iin TransactionModel.
  const TransactionModelData = {
    CID: ClientData.CustomerDetails._id,
    NetAmt:TotalCost,
    Y:today.getFullYear(),
    M:today.getMonth()+1,
    ProductList: products,
    Credit:ClientData.CreditAmount
  }

console.log(TransactionModelData)
  //Task 1: Add Data in Transaction Model With Credit Check.
  try {
    await transactionModel.create(TransactionModelData);

  } catch (error) {
    console.log(error)
    res.status(500).json({message:"error in adding data in transaction model."})
  }





  //Task 2: Update Customers Purchase History:
  const Purchase_History_Ele = {
      Year:today.getFullYear(),
<<<<<<< HEAD
      Month: today.getMonth()+1,
      Products: products,
      Product:products,
=======
      Month: today.getMonth(),
      Products: products
      
>>>>>>> 2d2404216954b994c2e3b28f33d332de75b3c5be
  }
  try {
    const h = await CustomerModel.updateOne({_id:ClientData.CustomerDetails._id},
      {$push : {Purchase_History : Purchase_History_Ele}}
    )


  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Error Updating Customer Profile!"})
  }




  //Task 3: Update each products history!!!
  /*
        - so i have an arr of products -> {PID:,Unit}
        - so why dont i for ele in products:
            update ele._id and append this in the array of ele._id and last sold.
        Sale_history: [
                        {
                            Year: Number,
                            Month: Number,
                            Units: Number,
                        }
                    ],
                    & Last_Sold: TimeStamp of today.
                    also reduce the stock thing.
  
  */

  for (let product of products){
     let Sales_history_Ele = {
      Year:today.getFullYear(),
      Month: today.getMonth() + 1,
      Units: product.Unit
     }
     try {
      await ProductModel.updateOne(
        {_id:product.PID},
        {
          $push: {Sales_History:Sales_history_Ele },
          Last_Sold:today.getDate(),
          // Stock:Stock-product.Unit
        }
      )
     } catch (error) {
      console.log(error)
      res.status(500).json({message:"Error Updating Product Profile!"})
     }
  }

  //if it came till here it means we are successfull!!!
  res.status(200).json({message:"Success"})

})


/*
 - POST:api/getProductById

 # PURPOSE:
  - fetch product data based on id.

*/


app.post("/api/getProductById",async(req,res)=>{
  const id = req.body.Id;

  if (!id){
    res.status(400).json({message:"Product Id not there!"})
  }
  try {
    const data = await ProductModel.findById(id)
<<<<<<< HEAD
=======
    
>>>>>>> 2d2404216954b994c2e3b28f33d332de75b3c5be
    if (!data) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({Data:data});
   
  } catch (error) {
    console.log(error)
  }
})



app.post("/api/getCustomerData",async(req,res)=>{
  const id = req.body.CN;

  if (!id){
    res.status(400).json({message:"Customer Not there!"})
  }
  try {
    const data = await CustomerModel.find({Phone:id})
<<<<<<< HEAD

=======
    
>>>>>>> 2d2404216954b994c2e3b28f33d332de75b3c5be
    if (!data) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({Data:data});
   
  } catch (error) {
    console.log(error)
  }
})

<<<<<<< HEAD

/*
POST: api/getCustomerDebt
req.body: CID -> customer ID.

- get all customer transaction where Credit > 0 from transactionModel

*/



app.post("/api/getCustomerDebt",async(req,res)=>{
  const clientData = req.body
  try {
    const result = await transactionModel.aggregate([
      { $match: { CID: clientData.CID, Credit: { $gt: 0 } } },
      { $group: { _id: null, totalCredit: { $sum: "$Credit" } } }
    ]);

    
    const totalCredit = result.length > 0 ? result[0].totalCredit : 0;
    res.status(200).json({message:"Successfully Performed!",Credit:totalCredit})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"internal Err"})
  }
})




=======
>>>>>>> 2d2404216954b994c2e3b28f33d332de75b3c5be
// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
