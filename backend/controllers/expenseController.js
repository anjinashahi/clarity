const Expense = require("../models/expenseModel");

exports.addExpense = async (req, res) => {
    try{
        const {amount, category, date, description} = req.body;
        const expnese =new Expense({
            user: req.user.userId,
            amount,
            category,
            date,
            description,
        });
        await expnese.save();
        res.status(201).json(expnese);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { returnDocument: 'after' }
    );
    if (!expense) return res.status(404).json({ msg: "Expense not found" });
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!expense) return res.status(404).json({ msg: "Expense not found" });
    res.json({ msg: "Expense deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
