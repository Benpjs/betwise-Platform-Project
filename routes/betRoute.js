const express = require('express');
const router = express.Router();
const { placeBet, getUserBets } = require('../controllers/betController');
const authenticateUser = require('../middlewares/auth');

router.post('/place', authenticateUser, placeBet);
router.get('/my-bets', authenticateUser, getUserBets);

module.exports = router;
