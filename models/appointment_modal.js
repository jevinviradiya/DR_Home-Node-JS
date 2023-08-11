const { ObjectId } = require("mongodb");
const mongoose = require("../config/config");

const appointmentSchema = new mongoose.Schema(
  {
    register_id: {
        type: ObjectId,
    },
    appointment_date: {
      type: String
    },
    appointment_time: {
      type: String
    },
    symptoms: {
      type: String
    },
    status: {
      type: String,
      default: "Pending"
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Appointment", appointmentSchema);