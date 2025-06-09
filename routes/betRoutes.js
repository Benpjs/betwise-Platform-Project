const express = require("express");
const { placeBet,  getBetHistory } = require("../controllers/betController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/place-bet", auth, placeBet,);

router.get('/my-bets', auth, getBetHistory);




module.exports = router;
