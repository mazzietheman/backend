const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['seller', 'receiver', 'buyer'], required: true },
  qrCode: { type: String, unique: true },
});

userSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'memberId',
});

module.exports = mongoose.model('User', userSchema);
