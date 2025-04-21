const { UserSchema } = require("../models/models_import");
const { successResponse, errorResponse } = require("../helper/response.helper");

const addUser = async (req, res) => {
  try {
    const { name, email, phone, ticket_id, passport_id } = req.body;

    const newUser = new UserSchema({
      name,
      email,
      phone,
      ticket_id,
      passport_id,
    });

    await newUser.save();

    return successResponse(res, "User added successfully", newUser);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error occurred while adding the user");
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await UserSchema.find();

    if (!users || users.length === 0) {
      return errorResponse(res, "No users found");
    }

    return successResponse(res, "Users fetched successfully", users);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error occurred while fetching users");
  }
};

const getUser = async (req, res) => {
  try {
    const { ticket_id } = req.params; 

    const user = await UserSchema.findOne({ ticket_id: ticket_id });

    if (!user) {
      return errorResponse(res, "User not found");
    }

    return successResponse(res, "User fetched successfully", user);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Error occurred while fetching user");
  }
};

module.exports = { addUser, getUsers, getUser };
