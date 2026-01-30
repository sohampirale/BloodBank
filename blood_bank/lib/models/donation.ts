import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  quantity: {
    type: Number,
    required: true,
    min: 250,
    max: 500,
  },
  donationDate: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: true,
    default: 'Main Center',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed'],
    default: 'pending',
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

DonationSchema.index({ donorId: 1 });
DonationSchema.index({ bloodType: 1 });
DonationSchema.index({ status: 1 });
DonationSchema.index({ donationDate: -1 });

export default mongoose.models.Donation || mongoose.model('Donation', DonationSchema);