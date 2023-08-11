const mongoose = require("../config/config");

const branchSchema = new mongoose.Schema(
  {
    branch_name: {
      type: String
    },
    email: {
      type: String,
      match: [
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        "Please fill a valid email address",
      ],
    },
    opening_date: {
      type: String
    },
    contact_no: {
      type: Number
    },
    city: {
      type: String
    },
    address: {
      type: String
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Branch", branchSchema);