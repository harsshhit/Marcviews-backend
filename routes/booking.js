const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const { protect } = require("../middleware/auth");

// Get user's bookings
router.get("/", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({
      bookingDate: -1,
    });

    res.status(200).json({
      status: "success",
      data: { bookings },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a single booking
router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this booking" });
    }

    res.status(200).json({
      status: "success",
      data: { booking },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new booking
router.post("/", protect, async (req, res) => {
  try {
    const { serviceId, bookingDate, notes } = req.body;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      serviceId,
      serviceName: service.name,
      price: service.price,
      bookingDate,
      notes,
    });

    res.status(201).json({
      status: "success",
      data: { booking },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update booking status
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this booking" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      status: "success",
      data: { booking },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel booking
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      status: "success",
      data: { booking },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
