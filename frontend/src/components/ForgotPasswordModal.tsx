import React, { useState } from "react";
import { authAPI } from "../services/api";
import "./ForgotPasswordModal.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.forgotPassword(email);
      setSuccess(true);
      setResetToken(response.resetToken);
    } catch (err: any) {
      setError(err.message || "Failed to request password reset");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError(null);
    setSuccess(false);
    setResetToken(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Reset Password</h2>
          <button className="modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        {success && resetToken ? (
          <div className="modal-body">
            <p className="success-message">
              Password reset link has been generated. You can use the following token:
            </p>
            <div className="token-box">
              <code>{resetToken}</code>
            </div>
            <p className="reset-link-hint">
              Or visit: <strong>/reset-password/{resetToken}</strong>
            </p>
            <p className="note">
              This token is valid for 30 minutes. In production, this would be sent via email.
            </p>
            <button className="reset-btn" onClick={handleClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleRequestReset}>
            <div className="modal-body">
              <p>Enter your email address and we'll send you a password reset link.</p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="modal-input"
              />
              {error && <div className="error-message">{error}</div>}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="reset-btn"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
