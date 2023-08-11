const { ObjectId } = require("mongodb");
const mongoose = require("../config/config");

const treatmentPaymentSchema = new mongoose.Schema(
  {
    register_id: {
        type: ObjectId,
        // ref: "Register"
    },
    payment_amount: {
      type: Number,
      default: 0
    },
    payment_status: {
      type: String,
      default: "Success",
    },
    action: {
      type: String,
      default: "Pending"
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("treatmentPayment", treatmentPaymentSchema);