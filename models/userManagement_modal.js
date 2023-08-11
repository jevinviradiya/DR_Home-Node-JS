const { ObjectId } = require("mongodb");
const mongoose = require("../config/config");

const userManagementSchema = new mongoose.Schema(
  {
    user_id: {
        type: ObjectId,
    },
    name: {
        type: String,
    },
    branch_name: {
      type: String,
    },
    date: {
      type: String,
    },
    contact_no: {
      type: Number,
    },
    user_type: {
      type: String,
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("userManagement", userManagementSchema);