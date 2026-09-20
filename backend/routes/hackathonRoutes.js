const express = require("express");
const router = express.Router();

const Hackathon = require("../models/Hackathon");

// CREATE - Add a new hackathon
router.post("/", async (req, res) => {
  try {
    const hackathon = await Hackathon.create(req.body);
    res.status(201).json(hackathon);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// READ - Get all hackathons
router.get("/", async (req, res) => {
  try {
    const hackathons = await Hackathon.find();
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// READ - Get one hackathon by ID
router.get("/:id", async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        message: "Hackathon not found"
      });
    }

    res.json(hackathon);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// UPDATE - Update a hackathon
router.put("/:id", async (req, res) => {
  try {
    const hackathon = await Hackathon.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!hackathon) {
      return res.status(404).json({
        message: "Hackathon not found"
      });
    }

    res.json(hackathon);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// DELETE - Delete a hackathon
router.delete("/:id", async (req, res) => {
  try {
    const hackathon = await Hackathon.findByIdAndDelete(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        message: "Hackathon not found"
      });
    }

    res.json({
      message: "Hackathon deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;