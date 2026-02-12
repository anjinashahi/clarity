import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authAPI } from "../services/api";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. No token provided.");
    }
  }, [token]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(token || "", newPassword);
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Token may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="reset-container">
        <div className="reset-card">
          <h1>Reset Password</h1>
          <p className="error-text">Invalid reset link. Please request a new password reset.</p>
          <button
            className="back-button"
            onClick={() => navigate("/")}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="reset-container">
        <div className="reset-card">
          <h1>Password Reset Successful</h1>
          <p className="success-text">
            Your password has been successfully reset. Redirecting to login...
          </p>
          <button
            className="back-button"
            onClick={() => navigate("/")}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h1>Reset Your Password</h1>
        <p>Enter your new password below</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-field">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-field">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
