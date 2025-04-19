const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Service name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Service description is required"],
  },
  price: {
    type: Number,
    required: [true, "Service price is required"],
  },
  category: {
    type: String,
    required: [true, "Service category is required"],
    enum: [
      "Security Audit",
      "Consultation",
      "Training",
      "Implementation",
      "Other",
    ],
  },
  image: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
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
serviceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
