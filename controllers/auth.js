require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const responseData = require("../helper/response");


exports.signInUser = async (req, res) => {
  try {
    const userData = req.body;
    const userList = await User.aggregate([
      {
        $match: {
          email: userData.email.toLowerCase(),
        }
      }
    ]);
    if (userList.length > 0 && await bcrypt.compare(userData.password, userList[0].password)) {

      const token = jwt.sign(
        { user_id: userList[0]._id, email: userList[0].email, access_menus: userList[0].access_menus },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      userList[0].auth_token = token;
      await User.findOneAndUpdate({ _id: userList[0]._id }, { auth_token: token });
      return responseData.sendResponse(res, 'User login successfully', userList[0]);
    }
    else {
      return responseData.errorResponse(res, 'User Not Found');
    }
  } catch (err) {
    return responseData.serverErrResponse(res, err.message);
  }
}


exports.signUpUser = async (req, res) => {
  try {
    const userData = req.body;
    const { user_type } = userData;
    const userList = await User.aggregate([
      {
        $match: {
          email: userData.email.toLowerCase(),
        },
      },
    ]);

    if (userList.length > 0) {
      if (res) {
        return responseData.errorResponse(res, "User Already Exist");
      } else {
        throw new Error("User Already Exist");
      }
    } else {
      let userRole;
      if (user_type === "receptionist") {
        userRole = "receptionist";
      } else if (user_type === "dietitian" || user_type === "doctor") {
        userRole = "doctor";
      } else {
        userRole = "user";
      }

      let encryptedPassword = await bcrypt.hash(userData.password, 10);
      let data = await User.create({
        name: userData.name,
        email: userData.email,
        password: encryptedPassword,
        role: userRole,
      });

      if (res) {
        return responseData.createResponse(res, 'User created Successfully', data);
      } else {
        return data;
      }
    }
  } catch (err) {
    if (res) {
      return responseData.serverErrResponse(res, err.message);
    } else {
      throw err;
    }
  }
};
