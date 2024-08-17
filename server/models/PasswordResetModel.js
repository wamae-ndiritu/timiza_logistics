const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ResetPasswordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    otp: {type: String, required: true}
  },
  { timestamps: true }
);

// Hash otp before saving
ResetPasswordSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) return next();

  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
  next();
});

// Verify password
ResetPasswordSchema.methods.compareOtp = function (otp) {
  return bcrypt.compare(otp, this.otp);
};


const PasswordReset = mongoose.model(
  "PasswordReset",
  ResetPasswordSchema
);
module.exports = PasswordReset;
