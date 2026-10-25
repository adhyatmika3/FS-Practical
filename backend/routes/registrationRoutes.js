const express = require("express");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const Registration = require("../models/Registration");
const Hackathon = require("../models/Hackathon");
const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

// Helper function to parse dates timezone-safely
const parseDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
    const [y, m, d] = dateStr.trim().split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);
    const months = {
      january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2,
      april: 3, apr: 3, may: 4, june: 5, jun: 5, july: 6, jul: 6,
      august: 7, aug: 7, september: 8, sep: 8, sept: 8, october: 9, oct: 9,
      november: 10, nov: 10, december: 11, dec: 11
    };
    if (!isNaN(day) && !isNaN(year) && monthName in months) {
      return new Date(year, months[monthName], day);
    }
  }

  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
};

// 1. POST /api/registrations - Register authenticated user for a hackathon
router.post(
  "/",
  authenticateToken,
  [
    body("hackathonId")
      .notEmpty()
      .withMessage("Hackathon ID is required")
      .custom((id) => mongoose.isValidObjectId(id))
      .withMessage("Invalid hackathon ID")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { hackathonId } = req.body;
      const userId = req.user.userId; // Securely extracted from verified token

      // Verify hackathon exists
      const hackathon = await Hackathon.findById(hackathonId);
      if (!hackathon) {
        return res.status(404).json({
          success: false,
          message: "Hackathon not found"
        });
      }

      // Check eligibility (must not be in the past)
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const eventDate = parseDate(hackathon.date);
      if (eventDate && eventDate < startOfToday) {
        return res.status(400).json({
          success: false,
          message: "Cannot register for a completed hackathon."
        });
      }

      const deadline = parseDate(hackathon.registrationDeadline);
      if (deadline && deadline < startOfToday) {
        return res.status(400).json({
          success: false,
          message: "Registration deadline for this hackathon has passed."
        });
      }

      // Check if user is already registered
      const existing = await Registration.findOne({
        user: userId,
        hackathon: hackathonId
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: "You are already registered for this hackathon."
        });
      }

      // Create permanent MongoDB registration record
      const registration = await Registration.create({
        user: userId,
        hackathon: hackathonId
      });

      await registration.populate([
        { path: "user", select: "name email" },
        { path: "hackathon" }
      ]);

      const io = req.app.get("io");
      if (io) {
        io.emit("new-registration", registration);
      }

      return res.status(201).json({
        success: true,
        message: "Registered successfully",
        data: registration
      });
    } catch (error) {
      console.error("Registration error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Unable to process registration"
      });
    }
  }
);

// 2. GET /api/registrations/my - Retrieve current authenticated user's registrations
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const registrations = await Registration.find({ user: userId })
      .populate("hackathon")
      .sort({ createdAt: -1 });

    // Filter out records where hackathon might have been deleted
    const validRegistrations = registrations.filter((r) => r.hackathon !== null);

    return res.status(200).json({
      success: true,
      data: validRegistrations
    });
  } catch (error) {
    console.error("Get user registrations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch registrations"
    });
  }
});

// 3. GET /api/registrations - Admin-only endpoint to retrieve all registrations
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin"),
  async (req, res) => {
    try {
      const registrations = await Registration.find()
        .populate("user", "name email")
        .populate("hackathon", "name date")
        .sort({ createdAt: -1 });

      const validRegistrations = registrations.filter(
        (r) => r.user !== null && r.hackathon !== null
      );

      return res.status(200).json({
        success: true,
        count: validRegistrations.length,
        data: validRegistrations
      });
    } catch (error) {
      console.error("Get all registrations error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Unable to fetch registered participants"
      });
    }
  }
);

module.exports = router;
