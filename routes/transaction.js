// routes/transaction.js
const express = require('express');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

router.post('/scan-qr', transactionController.scanQRCode);
router.post('/input-product', transactionController.inputProductDetails);
router.post('/finalize', transactionController.finalizeGoods);

module.exports = router;

// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
  productType: { type: String, required: true },
  weight: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'finalized', 'approved', 'paid'] },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
  adminApproved: { type: Boolean, default: false },
  amount: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);