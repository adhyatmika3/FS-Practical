const express = require("express");
const mongoose = require("mongoose");
const { body, param, validationResult } = require("express-validator");
const router = express.Router();

const Announcement = require("../models/Announcement");
const User = require("../models/User");
const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

// Validation error handler
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Validate MongoDB ObjectId parameter
const validateId = [
  param("id")
    .custom((id) => mongoose.isValidObjectId(id))
    .withMessage("Invalid announcement ID"),
  validateRequest
];

// Validate announcement payload
const validateAnnouncement = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Announcement title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Announcement message is required"),

  body("priority")
    .optional()
    .isIn(["Normal", "Important", "Urgent"])
    .withMessage("Priority must be Normal, Important, or Urgent"),

  validateRequest
];

// GET /api/announcements - Fetch all published announcements (newest first)
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    console.error("Error fetching announcements:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcements"
    });
  }
});

// GET /api/announcements/:id - Fetch single announcement by ID
router.get("/:id", validateId, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found"
      });
    }

    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error("Error fetching announcement:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcement"
    });
  }
});

// POST /api/announcements - Create and broadcast announcement (Admin only)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin"),
  validateAnnouncement,
  async (req, res) => {
    try {
      const { title, message, priority = "Normal" } = req.body;

      // Resolve author name from user ID
      let authorName = "Admin";
      if (req.user?.userId) {
        const adminUser = await User.findById(req.user.userId).select("name");
        if (adminUser?.name) {
          authorName = adminUser.name;
        }
      }

      // Persist to MongoDB first before broadcasting
      const announcement = await Announcement.create({
        title: title.trim(),
        message: message.trim(),
        priority,
        author: req.user.userId,
        authorName,
        isPublished: true
      });

      // Broadcast live to all connected Socket.IO clients
      const io = req.app.get("io");
      if (io) {
        io.to("announcements").emit("new-announcement", announcement);
      }

      res.status(201).json({
        success: true,
        message: "Announcement published successfully",
        data: announcement
      });
    } catch (error) {
      console.error("Error publishing announcement:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to publish announcement"
      });
    }
  }
);

// PUT /api/announcements/:id - Update announcement (Admin only)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateId,
  validateAnnouncement,
  async (req, res) => {
    try {
      const { title, message, priority = "Normal" } = req.body;

      const updated = await Announcement.findByIdAndUpdate(
        req.params.id,
        {
          title: title.trim(),
          message: message.trim(),
          priority
        },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Announcement not found"
        });
      }

      // Broadcast update live to all connected clients
      const io = req.app.get("io");
      if (io) {
        io.to("announcements").emit("update-announcement", updated);
      }

      res.status(200).json({
        success: true,
        message: "Announcement updated successfully",
        data: updated
      });
    } catch (error) {
      console.error("Error updating announcement:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to update announcement"
      });
    }
  }
);

// DELETE /api/announcements/:id - Delete announcement (Admin only)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  validateId,
  async (req, res) => {
    try {
      const deleted = await Announcement.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Announcement not found"
        });
      }

      // Broadcast deletion live to all connected clients
      const io = req.app.get("io");
      if (io) {
        io.to("announcements").emit("delete-announcement", req.params.id);
      }

      res.status(200).json({
        success: true,
        message: "Announcement deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting announcement:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to delete announcement"
      });
    }
  }
);

module.exports = router;
