const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const { protect } = require("../middleware/auth");

// Get all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isAvailable: true });

    res.status(200).json({
      status: "success",
      data: { services },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get service by ID
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({
      status: "success",
      data: { service },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new service (admin only)
router.post("/", protect, async (req, res) => {
  try {
    // Check if user is admin (you should implement this check)
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ message: "Not authorized to create services" });
    // }

    const service = await Service.create(req.body);

    res.status(201).json({
      status: "success",
      data: { service },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update service (admin only)
router.put("/:id", protect, async (req, res) => {
  try {
    // Check if user is admin (you should implement this check)
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ message: "Not authorized to update services" });
    // }

    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({
      status: "success",
      data: { service },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete service (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    // Check if user is admin (you should implement this check)
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ message: "Not authorized to delete services" });
    // }

    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
