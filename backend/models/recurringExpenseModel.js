const mongoose = require("mongoose");

const recurringExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  frequency: { 
    type: String, 
    enum: ["daily", "weekly", "monthly", "yearly"], 
    required: true 
  },
  startDate: { type: Date, required: true },
  nextDueDate: { type: Date, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, collection: "recurringExpenses" });

module.exports = mongoose.model("RecurringExpense", recurringExpenseSchema);
