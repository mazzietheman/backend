// routes/transaction.js
const express = require('express');
const transactionController = require('../controllers/transactionController');
const router = express.Router();

router.post('/scan-qr', transactionController.scanQRCode);
router.post('/input-product', transactionController.inputProductDetails);
router.post('/finalize', transactionController.finalizeGoods);

module.exports = router;