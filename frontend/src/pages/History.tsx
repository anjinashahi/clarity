import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useExpense } from "../hooks/useFinance";
import { useIncome } from "../hooks/useFinance";
import "./History.css";

const History = () => {
  const { expenses, loading: expenseLoading, error: expenseError } = useExpense();
  const { incomes, loading: incomeLoading, error: incomeError } = useIncome();
  const [activeTab, setActiveTab] = useState<"expenses" | "incomes">("expenses");

  // Filter states for expenses
  const [expenseCategory, setExpenseCategory] = useState<string>("all");
  const [expenseStartDate, setExpenseStartDate] = useState<string>("");
  const [expenseEndDate, setExpenseEndDate] = useState<string>("");

  // Filter states for incomes
  const [incomeCategory, setIncomeCategory] = useState<string>("all");
  const [incomeStartDate, setIncomeStartDate] = useState<string>("");
  const [incomeEndDate, setIncomeEndDate] = useState<string>("");

  // Get unique categories
  const uniqueExpenseCategories = Array.from(
    new Set(expenses.map((e: any) => e.category))
  );
  const uniqueIncomeCategories = Array.from(
    new Set(incomes.map((i: any) => i.category))
  );

  // Filter expenses
  const filteredExpenses = expenses.filter((expense: any) => {
    const matchesCategory =
      expenseCategory === "all" || expense.category === expenseCategory;
    const expenseDate = new Date(expense.date);
    const matchesStartDate =
      !expenseStartDate ||
      expenseDate >= new Date(expenseStartDate);
    const matchesEndDate =
      !expenseEndDate ||
      expenseDate <= new Date(expenseEndDate);
    return matchesCategory && matchesStartDate && matchesEndDate;
  });

  // Filter incomes
  const filteredIncomes = incomes.filter((income: any) => {
    const matchesCategory =
      incomeCategory === "all" || income.category === incomeCategory;
    const incomeDate = new Date(income.date);
    const matchesStartDate =
      !incomeStartDate ||
      incomeDate >= new Date(incomeStartDate);
    const matchesEndDate =
      !incomeEndDate ||
      incomeDate <= new Date(incomeEndDate);
    return matchesCategory && matchesStartDate && matchesEndDate;
  });

  return (
    <div className="page-container">
      <Sidebar />

      <div className="content">
        <h2>Transaction History</h2>

        {/* Tabs */}
        <div className="history-tabs">
          <button
            className={`tab-btn ${activeTab === "expenses" ? "active" : ""}`}
            onClick={() => setActiveTab("expenses")}
          >
            Expenses
          </button>
          <button
            className={`tab-btn ${activeTab === "incomes" ? "active" : ""}`}
            onClick={() => setActiveTab("incomes")}
          >
            Income
          </button>
        </div>

        {/* Expenses Table */}
        {activeTab === "expenses" && (
          <div className="table-container">
            <h3>Expense History</h3>

            {/* Expense Filters */}
            <div className="filters">
              <div className="filter-group">
                <label htmlFor="expense-category">Category</label>
                <select
                  id="expense-category"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  {uniqueExpenseCategories.map((cat: string) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="expense-start-date">Start Date</label>
                <input
                  id="expense-start-date"
                  type="date"
                  value={expenseStartDate}
                  onChange={(e) => setExpenseStartDate(e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="expense-end-date">End Date</label>
                <input
                  id="expense-end-date"
                  type="date"
                  value={expenseEndDate}
                  onChange={(e) => setExpenseEndDate(e.target.value)}
                  className="filter-input"
                />
              </div>

              <button
                className="reset-btn"
                onClick={() => {
                  setExpenseCategory("all");
                  setExpenseStartDate("");
                  setExpenseEndDate("");
                }}
              >
                Reset Filters
              </button>
            </div>

            {expenseError && (
              <div className="error-message">{expenseError}</div>
            )}

            {expenseLoading ? (
              <p className="loading-text">Loading expenses...</p>
            ) : filteredExpenses.length === 0 ? (
              <div className="empty-state">
                <p>
                  {expenses.length === 0
                    ? "No expenses recorded yet"
                    : "No expenses match the selected filters"}
                </p>
              </div>
            ) : (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense: any) => (
                    <tr key={expense._id}>
                      <td>
                        <span className="category-badge expense">
                          {expense.category}
                        </span>
                      </td>
                      <td>
                        <span className="amount">
                          Rs {expense.amount.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="description">
                        {expense.description || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Income Table */}
        {activeTab === "incomes" && (
          <div className="table-container">
            <h3>Income History</h3>

            {/* Income Filters */}
            <div className="filters">
              <div className="filter-group">
                <label htmlFor="income-category">Category</label>
                <select
                  id="income-category"
                  value={incomeCategory}
                  onChange={(e) => setIncomeCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  {uniqueIncomeCategories.map((cat: string) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="income-start-date">Start Date</label>
                <input
                  id="income-start-date"
                  type="date"
                  value={incomeStartDate}
                  onChange={(e) => setIncomeStartDate(e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label htmlFor="income-end-date">End Date</label>
                <input
                  id="income-end-date"
                  type="date"
                  value={incomeEndDate}
                  onChange={(e) => setIncomeEndDate(e.target.value)}
                  className="filter-input"
                />
              </div>

              <button
                className="reset-btn"
                onClick={() => {
                  setIncomeCategory("all");
                  setIncomeStartDate("");
                  setIncomeEndDate("");
                }}
              >
                Reset Filters
              </button>
            </div>

            {incomeError && (
              <div className="error-message">{incomeError}</div>
            )}

            {incomeLoading ? (
              <p className="loading-text">Loading incomes...</p>
            ) : filteredIncomes.length === 0 ? (
              <div className="empty-state">
                <p>
                  {incomes.length === 0
                    ? "No income recorded yet"
                    : "No income matches the selected filters"}
                </p>
              </div>
            ) : (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncomes.map((income: any) => (
                    <tr key={income._id}>
                      <td>
                        <span className="category-badge income">
                          {income.category}
                        </span>
                      </td>
                      <td>
                        <span className="amount income-amount">
                          +Rs {income.amount.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        {new Date(income.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="description">
                        {income.description || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
