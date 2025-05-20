const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Optional to allow non-authenticated users to submit
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
  companySize: {
    type: String,
    enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
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
  country: {
    type: String,
    trim: true,
  },
  inquiry: {
    type: String,
    required: [true, "Inquiry is required"],
  },
  inquiryType: {
    type: String,
    enum: ["general", "sales", "support", "partnership", "other"],
    default: "general",
  },
  budget: {
    type: String,
    enum: ["<$5,000", "$5,000-$10,000", "$10,000-$25,000", "$25,000-$50,000", "$50,000+"],
  },
  timeframe: {
    type: String,
    enum: ["immediate", "1-3 months", "3-6 months", "6-12 months", "12+ months"],
  },
  howDidYouHear: {
    type: String,
    trim: true,
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
