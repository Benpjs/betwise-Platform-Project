const express = require('express');
const router = express.Router();
const { runPayouts, processPayouts } = require('../controllers/payoutController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Admin triggers payout processing
router.post('/payout', auth, admin, processPayouts);


module.exports = router;
