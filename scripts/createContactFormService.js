const mongoose = require("mongoose");
const Service = require("../models/Service");
require("dotenv").config();

async function createContactFormService() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Check if service already exists
    const existingService = await Service.findOne({
      _id: "contact-form-service",
    });
    if (existingService) {
      console.log("Contact form service already exists");
      return;
    }

    // Create the service
    const service = await Service.create({
      _id: "contact-form-service",
      name: "Contact Form Submission",
      description: "Service for tracking contact form submissions",
      price: 0,
      category: "Other",
      isAvailable: true,
    });

    console.log("Contact form service created successfully:", service);
  } catch (error) {
    console.error("Error creating contact form service:", error);
  } finally {
    await mongoose.disconnect();
  }
}

createContactFormService();
