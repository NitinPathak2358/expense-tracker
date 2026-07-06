const express = require('express');
const { getSummary, getCategoryBreakdown, getMonthlyTrend } = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/summary', getSummary);
router.get('/categories', getCategoryBreakdown);
router.get('/monthly', getMonthlyTrend);

module.exports = router;
