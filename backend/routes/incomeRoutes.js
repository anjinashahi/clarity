const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const { addIncome, getIncomes, deleteIncome, updateIncome } = require("../controllers/incomeController");

router.post("/", auth, addIncome);
router.get("/", auth, getIncomes);
router.delete("/:id", auth, deleteIncome);
router.put("/:id", auth, updateIncome);

module.exports = router;