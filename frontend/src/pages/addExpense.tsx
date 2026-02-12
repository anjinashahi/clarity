import React, { useState } from "react";
import Navbar from "../components/Sidebar";
import { useExpense } from "../hooks/useFinance";
import ConfirmModal from "../components/ConfirmModal";
import "./AddIncome.css"; // Reusing same styling

const AddExpense: React.FC = () => {
  const { expenses, loading, error, addExpense, updateExpense, deleteExpense } = useExpense();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [draftCategories, setDraftCategories] = useState<string[]>([]);
  
  // Get categories from saved expenses + draft categories
  const dbCategories = Array.from(new Set(
    expenses.map(expense => expense.category).filter(cat => cat)
  )).length > 0 
    ? Array.from(new Set(expenses.map(expense => expense.category)))
    : ["Food", "Transport", "Shopping", "Bills"];
  
  // Combine database categories with draft ones
  const categories = Array.from(new Set([...dbCategories, ...draftCategories]));

  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Inline editing states
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineEditData, setInlineEditData] = useState<any>(null);

  // Confirmation modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !date) return;

    setSubmitting(true);
    try {
      if (editingId) {
        await updateExpense(editingId, Number(amount), category, date, description);
        setEditingId(null);
      } else {
        await addExpense(Number(amount), category, date, description);
      }
      setAmount("");
      setDate("");
      setDescription("");
    } catch (err) {
      console.error("Failed to save expense:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (expense: any) => {
    setEditingId(expense._id);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDate(expense.date.split("T")[0]); // Format date for input
    setDescription(expense.description || "");
  };

  const handleCancel = () => {
    setEditingId(null);
    setAmount("");
    setDate("");
    setDescription("");
    setCategory("Food");
  };

  const handleInlineEdit = (expense: any) => {
    setInlineEditingId(expense._id);
    setInlineEditData({
      amount: expense.amount,
      category: expense.category,
      date: expense.date.split("T")[0],
      description: expense.description || "",
    });
  };

  const handleInlineCancel = () => {
    setInlineEditingId(null);
    setInlineEditData(null);
  };

  const handleInlineSave = async () => {
    if (!inlineEditingId || !inlineEditData || !inlineEditData.amount || !inlineEditData.date) return;

    try {
      await updateExpense(
        inlineEditingId,
        Number(inlineEditData.amount),
        inlineEditData.category,
        inlineEditData.date,
        inlineEditData.description
      );
      setInlineEditingId(null);
      setInlineEditData(null);
    } catch (err) {
      console.error("Failed to save expense:", err);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory) return;

    // Add to draft categories so it shows in dropdown
    if (!categories.includes(newCategory)) {
      setDraftCategories([...draftCategories, newCategory]);
    }
    // Set the category and close popup
    // The category will be saved with the expense record to database
    setCategory(newCategory);
    setNewCategory("");
    setShowPopup(false);
  };

  return (
    <div className="page-container">
      <Navbar />

      <div className="content">
        <h2>{editingId ? "Edit Expense" : "Add Expense"}</h2>

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

            <div className="category-row">
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>

              <button
                type="button"
                className="new-btn"
                onClick={() => setShowPopup(true)}
              >
                New
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              className="input-field"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
            {submitting ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update Expense" : "Add Expense")}
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
        <div className="table-wrapper">
          <h3>Expense Records</h3>

          {loading ? (
            <p>Loading expenses...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((item: any) => (
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
                            {categories.map((cat) => (
                              <option key={cat}>{cat}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            className="input-field"
                            type="date"
                            value={inlineEditData.date}
                            onChange={(e) =>
                              setInlineEditData({
                                ...inlineEditData,
                                date: e.target.value,
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
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td>{item.description || "-"}</td>
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

      {/* POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>New Category</h3>

            <input
              className="input-field"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category"
            />

            <div className="popup-buttons">
              <button className="submit-btn" onClick={handleAddCategory}>
                Add
              </button>

              <button
                className="cancel-btn"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Expense"
        message="Are you sure you want to delete this expense record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (deleteTargetId) {
            deleteExpense(deleteTargetId);
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

export default AddExpense;
