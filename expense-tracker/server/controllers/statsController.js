const Transaction = require('../models/Transaction');

// @desc    Summary totals (balance, income, expense)
// @route   GET /api/stats/summary
exports.getSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const match = { user: req.user._id };
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59Z');
    }

    const result = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const income = result.find((r) => r._id === 'income') || { total: 0, count: 0 };
    const expense = result.find((r) => r._id === 'expense') || { total: 0, count: 0 };

    res.json({
      success: true,
      data: {
        income: income.total,
        expense: expense.total,
        balance: income.total - expense.total,
        transactionCount: income.count + expense.count,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Category breakdown
// @route   GET /api/stats/categories
exports.getCategoryBreakdown = async (req, res, next) => {
  try {
    const { type = 'expense', startDate, endDate } = req.query;
    const match = { user: req.user._id, type };
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate + 'T23:59:59Z');
    }

    const data = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const grandTotal = data.reduce((s, d) => s + d.total, 0);

    res.json({
      success: true,
      data: data.map((d) => ({
        category: d._id,
        total: d.total,
        count: d.count,
        percentage: grandTotal ? ((d.total / grandTotal) * 100).toFixed(1) : 0,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Monthly trend (last N months)
// @route   GET /api/stats/monthly
exports.getMonthlyTrend = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const since = new Date();
    since.setMonth(since.getMonth() - months + 1);
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const data = await Transaction.aggregate([
      { $match: { user: req.user._id, date: { $gte: since } } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Reshape into [{month, income, expense}]
    const map = {};
    data.forEach(({ _id, total }) => {
      const key = `${_id.year}-${String(_id.month).padStart(2, '0')}`;
      if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
      map[key][_id.type] = total;
    });

    res.json({ success: true, data: Object.values(map) });
  } catch (err) {
    next(err);
  }
};
