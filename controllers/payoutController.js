const { processPayouts: runPayoutService } = require('../services/payoutService');

const processPayouts = async (req, res) => {
  try {
    await runPayoutService();
    res.status(200).json({ message: 'Payouts processed successfully' });
  } catch (error) {
    console.error('Error in processPayouts:', error);  // 🔍 Log the actual error
    res.status(500).json({ error: 'Failed to process payouts' });
  }
};

module.exports = { processPayouts };


