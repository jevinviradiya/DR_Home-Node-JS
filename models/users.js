const mongoose = require("../config/config");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null,
      match: [
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      default: null
    },
    auth_token: {
      type: String,
      default: null
    },
    role: {
      type: String,
    }, 
    access_menus: {
        type: [String],
        default: ["DASHBOARD", "REGISTRATION", "ONLINE_TREATMENT", "DIRECT_PAYMENT",
      "CLIENT_MANAGEMENT","APPOINTMENT","RISK_ASSESMENT","BLOG","MEDICINE","CLOSE_DATE","CMS","LISTINGS","BRANCH_MANAGEMENT","USER_MANAGEMENT"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
