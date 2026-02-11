import { useState } from "react";
import "./CategoryModal.css";

interface Props {
  onClose: () => void;
  onAdd: (category: string) => void;
}

const CategoryModal = ({ onClose, onAdd }: Props) => {
  const [categoryName, setCategoryName] = useState("");

  const handleAdd = () => {
    if (!categoryName) return;

    onAdd(categoryName);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>New Category</h2>

        <input
          type="text"
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        <div className="modal-buttons">
          <button onClick={handleAdd}>Add</button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
