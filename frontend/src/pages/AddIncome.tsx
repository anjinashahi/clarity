import React, { useState } from "react";
import Navbar from "../components/Sidebar";
import { useIncome } from "../hooks/useFinance";
import "./AddIncome.css";

const AddIncome: React.FC = () => {
  const { incomes, loading, error, addIncome, updateIncome, deleteIncome } = useIncome();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Salary");
  const [categories, setCategories] = useState(["Salary", "Freelance", "Gift"]);

  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !date) return;

    setSubmitting(true);
    try {
      if (editingId) {
        await updateIncome(editingId, Number(amount), category, date, description);
        setEditingId(null);
      } else {
        await addIncome(Number(amount), category, date, description);
      }
      setAmount("");
      setDate("");
      setDescription("");
    } catch (err) {
      console.error("Failed to save income:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (income: any) => {
    setEditingId(income._id);
    setAmount(income.amount.toString());
    setCategory(income.category);
    setDate(income.date.split("T")[0]); // Format date for input
    setDescription(income.description || "");
  };

  const handleCancel = () => {
    setEditingId(null);
    setAmount("");
    setDate("");
    setDescription("");
    setCategory("Salary");
  };

  const handleAddCategory = () => {
    if (!newCategory) return;

    setCategories([...categories, newCategory]);
    setCategory(newCategory);
    setNewCategory("");
    setShowPopup(false);
  };

  return (
    <div className="page-container">
      <Navbar />

      <div className="content">
        <h2>{editingId ? "Edit Income" : "Add Income"}</h2>

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
            {submitting ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update Income" : "Add Income")}
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
          <h3>Income Records</h3>

          {loading ? (
            <p>Loading incomes...</p>
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
                {incomes.map((item: any) => (
                  <tr key={item._id}>
                    <td>Rs {item.amount}</td>
                    <td>{item.category}</td>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>{item.description || "-"}</td>
                    <td>
                      <button
                        className="submit-btn"
                        onClick={() => handleEdit(item)}
                        style={{ padding: "5px 10px", fontSize: "12px", marginRight: "5px" }}
                      >
                        Edit
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => deleteIncome(item._id)}
                        style={{ padding: "5px 10px", fontSize: "12px" }}
                      >
                        Delete
                      </button>
                    </td>
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
    </div>
  );
};

export default AddIncome;
