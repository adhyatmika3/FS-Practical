const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    organizer: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    location: {
      type: String,
      required: true
    },

    date: {
      type: String,
      required: true
    },

    registrationDeadline: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Hackathon", hackathonSchema);