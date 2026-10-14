const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const Hackathon = require("../models/Hackathon");

// Check validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg
      }))
    });
  }

  next();
};

// Validate MongoDB ID
const validateId = [
  param("id")
    .custom((id) => mongoose.isValidObjectId(id))
    .withMessage("Invalid hackathon ID"),
  validateRequest
];

// Validate hackathon data
const validateHackathon = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Hackathon name is required"),

  body("organizer")
    .trim()
    .notEmpty()
    .withMessage("Organizer is required"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  body("date")
    .trim()
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date"),

  body("registrationDeadline")
    .trim()
    .notEmpty()
    .withMessage("Registration deadline is required")
    .isISO8601()
    .withMessage("Registration deadline must be a valid date"),

  validateRequest
];

// CREATE - Add a hackathon
router.post("/", validateHackathon, async (req, res) => {
  try {
    const hackathon = await Hackathon.create({
      name: req.body.name,
      organizer: req.body.organizer,
      description: req.body.description,
      location: req.body.location,
      date: req.body.date,
      registrationDeadline: req.body.registrationDeadline
    });

    res.status(201).json({
      success: true,
      data: hackathon
    });
  } catch (error) {
    console.error("Create hackathon error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to create hackathon"
    });
  }
});

// READ - Get all hackathons
router.get("/", async (req, res) => {
  try {
    const hackathons = await Hackathon.find();
    res.status(200).json({
      success: true,
      data: hackathons
    });
  } catch (error) {
    console.error("Get hackathons error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch hackathons"
    });
  }
});

// READ - Get one hackathon by ID
router.get("/:id", validateId, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found"
      });
    }

    res.status(200).json({
      success: true,
      data: hackathon
    });
  } catch (error) {
    console.error("Get hackathon error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch hackathon"
    });
  }
});

// UPDATE - Update a hackathon
router.put("/:id", [...validateId.slice(0, 1),
  body("name").optional().trim().notEmpty()
    .withMessage("Name cannot be empty"),
  body("organizer").optional().trim().notEmpty()
    .withMessage("Organizer cannot be empty"),
  body("description").optional().isString()
    .withMessage("Description must be a string"),
  body("location").optional().trim().notEmpty()
    .withMessage("Location cannot be empty"),
  body("date").optional().isISO8601()
    .withMessage("Date must be a valid date"),
  body("registrationDeadline").optional().isISO8601()
    .withMessage("Registration deadline must be a valid date"),
  validateRequest
], async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "organizer",
      "description",
      "location",
      "date",
      "registrationDeadline"
    ];

    const updateData = Object.fromEntries(
      Object.entries(req.body).filter(([key]) =>
        allowedFields.includes(key)
      )
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one valid field to update"
      });
    }

    const hackathon = await Hackathon.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found"
      });
    }

    res.status(200).json({
      success: true,
      data: hackathon
    });
  } catch (error) {
    console.error("Update hackathon error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to update hackathon"
    });
  }
});

// DELETE - Delete a hackathon
router.delete("/:id", validateId, async (req, res) => {
  try {
    const hackathon = await Hackathon.findByIdAndDelete(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Hackathon deleted successfully"
    });
  } catch (error) {
    console.error("Delete hackathon error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to delete hackathon"
    });
  }
});

module.exports = router;