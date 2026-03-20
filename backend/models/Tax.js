import mongoose from 'mongoose';

const taxSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rate: { type: Number, required: true }
});

const Tax = mongoose.model('Tax', taxSchema);
export default Tax;