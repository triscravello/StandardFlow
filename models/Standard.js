// models/Standard.js
const mongoose = require("mongoose");

const standardSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    description: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    gradeLevel: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Standard || mongoose.model("Standard", standardSchema);