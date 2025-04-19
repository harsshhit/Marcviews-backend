const express = require("express");
const router = express.Router();
const Career = require("../models/Career");
const { protect } = require("../middleware/auth");

// Create a new career application
router.post("/", protect, async (req, res) => {
  try {
    const career = await Career.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      status: "success",
      data: { career },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all career applications (admin only)
router.get("/", async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: { careers },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get career application by ID (admin only)
router.get("/:id", async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({ message: "Career application not found" });
    }

    res.status(200).json({
      status: "success",
      data: { career },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update career application status (admin only)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const career = await Career.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!career) {
      return res.status(404).json({ message: "Career application not found" });
    }

    res.status(200).json({
      status: "success",
      data: { career },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
