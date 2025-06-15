const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  setTransactionPin,
  fundWallet,
  withdrawFunds
} = require('../controllers/walletController');

router.post('/set-pin', auth, setTransactionPin);
router.post('/fund', auth, fundWallet);
router.post('/withdraw', auth, withdrawFunds);

module.exports = router;