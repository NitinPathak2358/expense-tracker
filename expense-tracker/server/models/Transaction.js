const mongoose = require('mongoose');

const INCOME_CATEGORIES = ['salary', 'freelance', 'investment', 'rental', 'gift', 'other_income'];
const EXPENSE_CATEGORIES = [
  'food', 'transport', 'housing', 'health', 'entertainment',
  'shopping', 'utilities', 'education', 'travel', 'other_expense',
];

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Transaction type is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      validate: {
        validator: function (val) {
          const all = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
          return all.includes(val);
        },
        message: 'Invalid category',
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

// Index for efficient queries
TransactionSchema.index({ user: 1, date: -1 });
TransactionSchema.index({ user: 1, type: 1 });
TransactionSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
