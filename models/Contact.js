const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
  industry: {
    type: String,
    trim: true,
  },
  companyName: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
  },
  companyWebsite: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  inquiry: {
    type: String,
    required: [true, "Inquiry is required"],
  },
  signUpForUpdates: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["new", "in-progress", "resolved", "closed"],
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
contactSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
