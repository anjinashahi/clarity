import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useRecurringExpense } from "../hooks/useRecurringExpense";
import ConfirmModal from "../components/ConfirmModal";
import "./AddIncome.css";

const RecurringExpense: React.FC = () => {
  const {
    recurringExpenses,
    loading,
    error,
    fetchRecurringExpenses,
    addRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
  } = useRecurringExpense();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Rent");
  const [frequency, setFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Inline editing states
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineEditData, setInlineEditData] = useState<any>(null);

  // Confirmation modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    fetchRecurringExpenses();
  }, [fetchRecurringExpenses]);

  const dbCategories = Array.from(
    new Set(recurringExpenses.map((e: any) => e.category).filter(cat => cat))
  ).length > 0
    ? Array.from(new Set(recurringExpenses.map((e: any) => e.category)))
    : ["Rent", "Utilities", "Insurance", "Subscription"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !startDate) return;

    setSubmitting(true);
    try {
      if (editingId) {
        await updateRecurringExpense(
          editingId,
          Number(amount),
          category,
          frequency,
          startDate,
          description
        );
        setEditingId(null);
      } else {
        await addRecurringExpense(
          Number(amount),
          category,
          frequency,
          startDate,
          description
        );
      }
      setAmount("");
      setStartDate("");
      setDescription("");
      setCategory("Rent");
      setFrequency("monthly");
    } catch (err) {
      console.error("Failed to save recurring expense:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (expense: any) => {
    setEditingId(expense._id);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setFrequency(expense.frequency);
    setStartDate(expense.startDate.split("T")[0]);
    setDescription(expense.description || "");
  };

  const handleCancel = () => {
    setEditingId(null);
    setAmount("");
    setStartDate("");
    setDescription("");
    setCategory("Rent");
    setFrequency("monthly");
  };

  const handleInlineEdit = (expense: any) => {
    setInlineEditingId(expense._id);
    setInlineEditData({
      amount: expense.amount,
      category: expense.category,
      frequency: expense.frequency,
      startDate: expense.startDate.split("T")[0],
      description: expense.description || "",
      isActive: expense.isActive,
    });
  };

  const handleInlineCancel = () => {
    setInlineEditingId(null);
    setInlineEditData(null);
  };

  const handleInlineSave = async () => {
    if (!inlineEditingId || !inlineEditData || !inlineEditData.amount || !inlineEditData.startDate) return;

    try {
      await updateRecurringExpense(
        inlineEditingId,
        Number(inlineEditData.amount),
        inlineEditData.category,
        inlineEditData.frequency,
        inlineEditData.date,
        inlineEditData.description,
        inlineEditData.isActive
      );
      setInlineEditingId(null);
      setInlineEditData(null);
    } catch (err) {
      console.error("Failed to save recurring expense:", err);
    }
  };

  const handleToggleActive = async (expense: any) => {
    try {
      await updateRecurringExpense(
        expense._id,
        expense.amount,
        expense.category,
        expense.frequency,
        expense.startDate,
        expense.description,
        !expense.isActive
      );
    } catch (err) {
      console.error("Failed to toggle recurring expense:", err);
    }
  };

  return (
    <div className="page-container">
      <Sidebar />

      <div className="content">
        <h2>{editingId ? "Edit Recurring Expense" : "Add Recurring Expense"}</h2>

        {/* FORM */}
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount</label>
            <input
              className="input-field"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {dbCategories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
              <option value="Rent">Rent</option>
              <option value="Utilities">Utilities</option>
              <option value="Insurance">Insurance</option>
              <option value="Subscription">Subscription</option>
            </select>
          </div>

          <div className="form-group">
            <label>Frequency</label>
            <select
              className="input-field"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              className="input-field"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              className="input-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button className="submit-btn" disabled={submitting}>
            {submitting
              ? editingId
                ? "Updating..."
                : "Adding..."
              : editingId
              ? "Update Recurring Expense"
              : "Add Recurring Expense"}
          </button>
          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              style={{ marginLeft: "10px" }}
            >
              Cancel Edit
            </button>
          )}
        </form>

        {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

        {/* TABLE */}
        <div style={{ marginTop: "40px" }}>
          <h3>Recurring Expenses</h3>

          {loading ? (
            <p>Loading recurring expenses...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Frequency</th>
                  <th>Next Due</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {recurringExpenses.map((item: any) => (
                  <tr key={item._id}>
                    {inlineEditingId === item._id ? (
                      <>
                        <td>
                          <input
                            className="input-field"
                            type="number"
                            value={inlineEditData.amount}
                            onChange={(e) =>
                              setInlineEditData({
                                ...inlineEditData,
                                amount: e.target.value,
                              })
                            }
                            style={{ padding: "6px", fontSize: "14px" }}
                          />
                        </td>
                        <td>
                          <select
                            className="input-field"
                            value={inlineEditData.category}
                            onChange={(e) =>
                              setInlineEditData({
                                ...inlineEditData,
                                category: e.target.value,
                              })
                            }
                            style={{ padding: "6px", fontSize: "14px" }}
                          >
                            {dbCategories.map((cat) => (
                              <option key={cat}>{cat}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            className="input-field"
                            value={inlineEditData.frequency}
                            onChange={(e) =>
                              setInlineEditData({
                                ...inlineEditData,
                                frequency: e.target.value,
                              })
                            }
                            style={{ padding: "6px", fontSize: "14px" }}
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                        </td>
                        <td>
                          <input
                            className="input-field"
                            type="date"
                            value={inlineEditData.startDate}
                            onChange={(e) =>
                              setInlineEditData({
                                ...inlineEditData,
                                startDate: e.target.value,
                              })
                            }
                            style={{ padding: "6px", fontSize: "14px" }}
                          />
                        </td>
                        <td>
                          <input
                            className="input-field"
                            type="text"
                            value={inlineEditData.description}
                            onChange={(e) =>
                              setInlineEditData({
                                ...inlineEditData,
                                description: e.target.value,
                              })
                            }
                            style={{ padding: "6px", fontSize: "14px" }}
                          />
                        </td>
                        <td>
                          <select
                            className="input-field"
                            value={inlineEditData.isActive}
                            onChange={(e) =>
                              setInlineEditData({
                                ...inlineEditData,
                                isActive: e.target.value === "true",
                              })
                            }
                            style={{ padding: "6px", fontSize: "14px" }}
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="submit-btn"
                            onClick={handleInlineSave}
                            style={{ padding: "5px 10px", fontSize: "12px", marginRight: "5px" }}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={handleInlineCancel}
                            style={{ padding: "5px 10px", fontSize: "12px" }}
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>Rs {item.amount}</td>
                        <td>{item.category}</td>
                        <td style={{ textTransform: "capitalize" }}>{item.frequency}</td>
                        <td>{new Date(item.nextDueDate).toLocaleDateString()}</td>
                        <td>{item.description || "-"}</td>
                        <td>
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              backgroundColor: item.isActive ? "#10b981" : "#ef4444",
                              color: "white",
                              fontSize: "12px",
                            }}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="submit-btn"
                            onClick={() => handleInlineEdit(item)}
                            style={{ padding: "5px 10px", fontSize: "12px", marginRight: "5px" }}
                          >
                            Edit
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => {
                              setDeleteTargetId(item._id);
                              setShowDeleteConfirm(true);
                            }}
                            style={{ padding: "5px 10px", fontSize: "12px" }}
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Recurring Expense"
        message="Are you sure you want to delete this recurring expense? Future expenses will not be created."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteRecurringExpense(deleteTargetId);
            setShowDeleteConfirm(false);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteTargetId(null);
        }}
        isDangerous={true}
      />
    </div>
  );
};

export default RecurringExpense;
