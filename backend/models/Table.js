import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true, unique: true },
  seats: { type: Number, required: true },
  status: { type: String, enum: ['available', 'occupied'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

const Table = mongoose.model('Table', tableSchema);
export default Table;