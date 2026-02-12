const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  addRecurringExpense,
  getRecurringExpenses,
  updateRecurringExpense,
  deleteRecurringExpense,
} = require("../controllers/recurringExpenseController");

router.post("/", auth, addRecurringExpense);
router.get("/", auth, getRecurringExpenses);
router.put("/:id", auth, updateRecurringExpense);
router.delete("/:id", auth, deleteRecurringExpense);

module.exports = router;
