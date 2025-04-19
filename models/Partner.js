const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
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
  company: {
    type: String,
    trim: true,
  },
  servicesInterested: {
    type: String,
    required: [true, "Services interested in is required"],
    trim: true,
  },
  status: {
    type: String,
    enum: ["new", "in-review", "approved", "rejected"],
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
partnerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Partner = mongoose.model("Partner", partnerSchema);

module.exports = Partner;
