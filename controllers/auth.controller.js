const _ = require("lodash");
const { AdminSchema } = require("../models/models_import");
const { PlaintoHash, GenerateToken, EncryptPassword } = require("../helper/shared.helper");
const { successResponse, errorResponse } = require("../helper/response.helper");
const { INVALID_ACCOUNT_DETAILS, INCORRECT_PASSWORD, LOGIN_SUCCESS, PASSWORD_CHANGED_SUCCESSFULLY, PASSWORD_CHANGED_FAILED } = require("../helper/message.helper");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await AdminSchema.aggregate([{ $match: { email } }]);
    const user = users[0];

    if (!user) {
      return errorResponse(res, INVALID_ACCOUNT_DETAILS);
    }

    const isPasswordValid = await PlaintoHash(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(res, INCORRECT_PASSWORD);
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = await GenerateToken(payload);

    delete user.password;
    
    return successResponse(res, LOGIN_SUCCESS, {
      ...user,
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return errorResponse(res, "An error occurred while logging in");
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userData.id;

    const user = await AdminSchema.findById(userId);
    if (!user) {
      return errorResponse(res, "User not found");
    }

    const isMatch = await PlaintoHash(oldPassword, user.password);
    if (!isMatch) {
      return errorResponse(res, INCORRECT_PASSWORD);
    }

    user.password = await EncryptPassword(newPassword);
    await user.save();

    return successResponse(res, PASSWORD_CHANGED_SUCCESSFULLY);
  } catch (err) {
    console.error("Change Password Error:", err);
    return errorResponse(res, PASSWORD_CHANGED_FAILED);
  }
};

const checkLoginStatus = async (req, res) => {
  try {
    const { id } = req.userData;

    const user = await AdminSchema.findById(id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(200).json({ message: "Already logged in", data: user });
  } catch (err) {
    console.error("Check Login Status Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  login,
  changePassword,
  checkLoginStatus,
};
