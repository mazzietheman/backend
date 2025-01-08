const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.loginSeller = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    res.status(200).json({ status: 'success', userId: user._id });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// controllers/transactionController.js
const Transaction = require('../models/Transaction');

// ... rest of the code ...

exports.scanQRCode = async (req, res) => {
  const { qrCodeData } = req.body;

  try {
    const user = await User.findOne({ qrCode: qrCodeData });
    if (!user) {
      return res.status(400).json({ status: 'error', message: 'Invalid QR Code' });
    }
    res.status(200).json({ status: 'success', memberId: user._id });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.inputProductDetails = async (req, res) => {
    const { memberId, productType, weight } = req.body;
  
    try {
      const transaction = new Transaction({ memberId, productType, weight });
      await transaction.save();
      res.status(200).json({ status: 'success', transactionId: transaction._id });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  };

  
  exports.finalizeGoods = async (req, res) => {
    const { receiverId, transactionDetails } = req.body;
  
    try {
      const transaction = await Transaction.findByIdAndUpdate(transactionDetails.transactionId, { status: 'finalized', receiverId });
      if (!transaction) {
        return res.status(400).json({ status: 'error', message: 'Transaction finalization failed' });
      }
      res.status(200).json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  };

  
  exports.processAdminApproval = async (req, res) => {
    const { transactionId } = req.body;
  
    try {
      const transaction = await Transaction.findByIdAndUpdate(transactionId, { adminApproved: true });
      if (!transaction) {
        return res.status(400).json({ status: 'error', message: 'Approval failed' });
      }
      res.status(200).json({ status: 'success' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  };
  