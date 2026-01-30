import mongoose from 'mongoose';

const BloodInventorySchema = new mongoose.Schema({
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: true,
    default: 'Main Center',
  },
  donors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

BloodInventorySchema.index({ bloodType: 1 });
BloodInventorySchema.index({ quantity: 1 });

export default mongoose.models.BloodInventory || mongoose.model('BloodInventory', BloodInventorySchema);