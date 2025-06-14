const express = require('express');
const router = express.Router();
const { createGame, setGameResult, processPayouts, getAllUsers } = require('../controllers/adminController');
const  auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.post('/create', auth, admin, createGame);
router.post('/create-result', auth, admin, setGameResult);
router.post('/process-payouts', auth, admin, processPayouts);
router.get('/users', auth, admin, getAllUsers);
module.exports = router;
