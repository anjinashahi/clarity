const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Register new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Forgot password - generate reset token
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Generate reset token (valid for 30 minutes)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000);

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // In production, send email with reset link
    // For now, return the token (frontend can use it)
    res.json({
      msg: "Reset token sent to email",
      resetToken, // Remove this in production after email is set up
      resetLink: `http://localhost:5173/reset-password/${resetToken}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Reset password - verify token and update password
exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
