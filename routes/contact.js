const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { protect, restrictTo } = require("../middleware/auth");

// Middleware to check if user is authenticated and add user ID if available
const optionalAuth = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Try to authenticate the user
      return protect(req, res, next);
    }
    // If no auth header, continue without authentication
    next();
  } catch (error) {
    // If authentication fails, continue without authentication
    next();
  }
};

// Create a new contact submission (works for both authenticated and non-authenticated users)
router.post("/", optionalAuth, async (req, res) => {
  try {
    const contactData = { ...req.body };

    // If user is authenticated, add user ID
    if (req.user) {
      contactData.user = req.user.id;
    } else {
      // For non-authenticated users, ensure we don't try to use userId from the request
      delete contactData.userId; // Remove any userId that might have been sent
    }

    // Set default values for optional fields if not provided
    if (!contactData.inquiryType) contactData.inquiryType = "general";
    if (!contactData.status) contactData.status = "new";

    console.log("Creating contact submission:", contactData);

    // Create the contact
    const contact = await Contact.create(contactData);

    console.log("Contact created successfully:", contact._id);

    res.status(201).json({
      status: "success",
      data: { contact },
      message: "Your message has been sent successfully!"
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(400).json({
      status: "error",
      message: error.message || "Failed to submit contact form. Please try again."
    });
  }
});

// Get all contact submissions (admin only)
router.get("/", protect, restrictTo("admin"), async (req, res) => {
  try {
    // Add filtering options
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.inquiryType) filter.inquiryType = req.query.inquiryType;

    // Add sorting options
    const sort = req.query.sort || "-createdAt";

    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    // Execute query with populate
    const contacts = await Contact.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    // Get total count for pagination
    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      status: "success",
      results: contacts.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: { contacts },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    });
  }
});

// Get contact submission by ID (admin only)
router.get("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    if (!contact) {
      return res.status(404).json({
        status: "error",
        message: "Contact submission not found"
      });
    }

    res.status(200).json({
      status: "success",
      data: { contact },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    });
  }
});

// Update contact submission (admin only)
router.patch("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("assignedTo", "name email");

    if (!contact) {
      return res.status(404).json({
        status: "error",
        message: "Contact submission not found"
      });
    }

    res.status(200).json({
      status: "success",
      data: { contact },
      message: "Contact updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    });
  }
});

// Get user's own contact submissions
router.get("/my-submissions", protect, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id })
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: contacts.length,
      data: { contacts },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    });
  }
});

module.exports = router;
