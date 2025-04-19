const express = require("express");
const router = express.Router();
const Partner = require("../models/Partner");
const { protect } = require("../middleware/auth");

// Create a new partner application
router.post("/", protect, async (req, res) => {
  try {
    const partner = await Partner.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      status: "success",
      data: { partner },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all partner applications (admin only)
router.get("/", async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: { partners },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get partner application by ID (admin only)
router.get("/:id", async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: "Partner application not found" });
    }

    res.status(200).json({
      status: "success",
      data: { partner },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update partner application status (admin only)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!partner) {
      return res.status(404).json({ message: "Partner application not found" });
    }

    res.status(200).json({
      status: "success",
      data: { partner },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
