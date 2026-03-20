import mongoose from 'mongoose';

const cafeStatusSchema = new mongoose.Schema({
  isOnline: {
    type: Boolean,
    default: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('CafeStatus', cafeStatusSchema);