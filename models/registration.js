const { ObjectId } = require("mongodb");
const mongoose = require("../config/config");

const registerSchema = new mongoose.Schema(
  {
    user_id: {
      type: ObjectId,
    },
    name: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null,
    },
    birthday: {
      type: String,
      default: null
    },
    date: {
      type: String,
      default: null
    },
    phone_number: {
      type: Number,
      default: null
    },
    optional_phone_number: {
      type: Number,
      default: null
    },
    age: {
      type: Number,
      default: null
    },
    state: {
      type: String,
      default: null
    },
    zipcode: {
      type: Number,
      default: null
    },
    gender: {
      type: String,
      default: null
    },
    typeofpregnency: {
      type: String,
      default: null
    },
    current_disease: {
      type: String,
      default: null
    },
    current_disease_text: {
      type: String,
      default: null
    },
    followUpDate: {
      type: String,
    },
    patientHashKey: {
      type: String,
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Register", registerSchema);