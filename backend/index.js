import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 5000;

// MongoDB URI for Mongoose
const uri = "mongodb+srv://Admin101:RoyalCo.Blr.Web.2024@webroyalco.oaatc.mongodb.net/WebRoyalCo?retryWrites=true&w=majority";

// Connect Mongoose to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log("Successfully connected to MongoDB using Mongoose");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// MongoDB Models
import ProductModel from './models/productModel.js';
import CustomerModel from "./models/customerModel.js"
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
     res.status(200).json({Data:data,success:true})
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
    if(data.length > 0){
      res.status(200).json({success:true,Data:data})
    }else{
      res.status(402).json({success:false,message:"User Doesn't Exist!"})
    }
  } catch (error) {
    res.status(500).json({success:false,message:"internal server error"})
  }
})



// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
