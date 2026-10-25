const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate registrations by the same user for the same hackathon
registrationSchema.index({ user: 1, hackathon: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
