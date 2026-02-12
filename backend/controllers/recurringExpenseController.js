const RecurringExpense = require("../models/recurringExpenseModel");
const Expense = require("../models/expenseModel");

// Helper function to calculate next due date
const calculateNextDueDate = (currentDate, frequency) => {
  const date = new Date(currentDate);
  
  switch (frequency) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1);
  }
  
  return date;
};

// Create recurring expense
exports.addRecurringExpense = async (req, res) => {
  try {
    const { amount, category, frequency, startDate, description } = req.body;
    
    if (!amount || !category || !frequency || !startDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const nextDueDate = calculateNextDueDate(new Date(startDate), frequency);

    const recurringExpense = new RecurringExpense({
      user: req.user.userId,
      amount,
      category,
      frequency,
      startDate: new Date(startDate),
      nextDueDate,
      description,
      isActive: true,
    });

    await recurringExpense.save();
    res.status(201).json(recurringExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all recurring expenses for user
exports.getRecurringExpenses = async (req, res) => {
  try {
    const recurringExpenses = await RecurringExpense.find({ 
      user: req.user.userId 
    }).sort({ nextDueDate: 1 });
    
    res.json(recurringExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update recurring expense
exports.updateRecurringExpense = async (req, res) => {
  try {
    const { amount, category, frequency, startDate, description, isActive } = req.body;
    
    let updateData = { amount, category, frequency, description, isActive };
    
    // Recalculate nextDueDate if startDate or frequency changed
    if (startDate || frequency) {
      const currentStart = startDate ? new Date(startDate) : null;
      const recurringExpense = await RecurringExpense.findById(req.params.id);
      const dateToUse = currentStart || recurringExpense.startDate;
      const freqToUse = frequency || recurringExpense.frequency;
      
      updateData.nextDueDate = calculateNextDueDate(dateToUse, freqToUse);
      updateData.startDate = dateToUse;
    }

    const updatedExpense = await RecurringExpense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      updateData,
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Recurring expense not found" });
    }

    res.json(updatedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete recurring expense
exports.deleteRecurringExpense = async (req, res) => {
  try {
    const recurringExpense = await RecurringExpense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!recurringExpense) {
      return res.status(404).json({ message: "Recurring expense not found" });
    }

    res.json({ message: "Recurring expense deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Process due recurring expenses (called by cron job)
exports.processDueExpenses = async () => {
  try {
    const now = new Date();
    
    // Find all active recurring expenses that are due
    const dueExpenses = await RecurringExpense.find({
      isActive: true,
      nextDueDate: { $lte: now },
    });

    for (const recurringExpense of dueExpenses) {
      // Create actual expense
      const expense = new Expense({
        user: recurringExpense.user,
        amount: recurringExpense.amount,
        category: recurringExpense.category,
        date: new Date(),
        description: recurringExpense.description 
          ? `${recurringExpense.description} (recurring)` 
          : "Recurring expense",
      });

      await expense.save();

      // Update nextDueDate
      const nextDueDate = calculateNextDueDate(recurringExpense.nextDueDate, recurringExpense.frequency);
      await RecurringExpense.findByIdAndUpdate(recurringExpense._id, {
        nextDueDate,
      });

      console.log(`Processed recurring expense: ${recurringExpense._id}`);
    }
  } catch (error) {
    console.error("Error processing due expenses:", error);
  }
};
