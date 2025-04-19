const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { protect } = require("../middleware/auth");

// Create a new appointment
router.post("/", protect, async (req, res) => {
  try {
    console.log("Creating appointment for user:", req.user.id);
    console.log("Request body:", req.body);
    const appointment = await Appointment.create({
      ...req.body,
      user: req.user.id,
    });

    console.log("Appointment created:", appointment);
    res.status(201).json({
      status: "success",
      data: { appointment },
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(400).json({ message: error.message });
  }
});

// Get all appointments (admin only)
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: { appointments },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get appointment by ID (admin only)
router.get("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      status: "success",
      data: { appointment },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update appointment status (admin only)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      status: "success",
      data: { appointment },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
