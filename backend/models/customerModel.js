import mongoose from "mongoose";
const { Schema } = mongoose;



// Define the Purchase History Schema
const purchaseHistorySchema = new Schema({
  Year: { type: Number },  // Year of the purchase
  Month: { type: Number },  // Month of the purchase
  Products: Array,  // List of products purchased in this period
});

// Define the Customer Schema
const customerSchema = new Schema(
  {
   Name: { type: String },  // Customer's name
    Email: { type: String, unique: true },  // Customer's email
    Phone: { type: String, unique: true },  // Customer's phone number
    Purchase_History: [purchaseHistorySchema],  // Array of purchase history objects
  },
  { timestamps: true }  // Automatically add createdAt and updatedAt fields
);

// Create and export the Customer model
const CustomerModel = mongoose.model("Customer", customerSchema);
export default CustomerModel;
