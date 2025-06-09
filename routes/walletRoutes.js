
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { setTransactionPin } = require('../controllers/walletController');
const wallet = require("../controllers/walletController")
;



// Routes
router.post('/fund', authMiddleware, wallet.fundWallet);
router.post('/withdraw', authMiddleware, wallet.withdraw);
router.post('/set-transaction-pin', authMiddleware, setTransactionPin);

module.exports  = router;