const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { protect } = require("../middleware/auth");

// Create a new contact submission
router.post("/", protect, async (req, res) => {
  try {
    const contact = await Contact.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      status: "success",
      data: { contact },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all contact submissions (admin only)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: { contacts },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get contact submission by ID (admin only)
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" });
    }

    res.status(200).json({
      status: "success",
      data: { contact },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update contact submission status (admin only)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" });
    }

    res.status(200).json({
      status: "success",
      data: { contact },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
