import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  Stock: Object,
  Sales_History: Array,
  Last_Sold: { type: Date, default: null },
  GST_RATE: String
});

export default mongoose.model('Product', productSchema);
