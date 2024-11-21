const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: true,
    },
    cause: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cause',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
