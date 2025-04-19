const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
    trim: true,
  },
  linkedinProfile: {
    type: String,
    required: [true, "LinkedIn profile is required"],
    trim: true,
  },
  position: {
    type: String,
    trim: true,
  },
  resumeUrl: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: [
      "new",
      "in-review",
      "shortlisted",
      "interviewed",
      "hired",
      "rejected",
    ],
    default: "new",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp when the document is modified
careerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Career = mongoose.model("Career", careerSchema);

module.exports = Career;
