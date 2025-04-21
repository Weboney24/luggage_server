const { AdminSchema } = require("../models/models_import");
const { EncryptPassword } = require("../helper/shared.helper");
const { errorResponse, successResponse } = require("../helper/response.helper");
const { ADMIN_ADDED_SUCCESS, ADMIN_ADDED_FAILED, ADMIN_GETTED_SUCCESS, ADMIN_GETTED_FAILED, ADMIN_UPDATED_SUCCESS, ADMIN_UPDATED_FAILED, ADMIN_DELETED_SUCCESS, ADMIN_DELETED_FAILED, ADMIN_ACCOUNT_ALREADY_EXISTS } = require("../helper/message.helper");

const addAdmin = async (req, res) => {
  const { email, password, name, role, phone } = req.body;

  try {
    const existingAdmin = await AdminSchema.findOne({ email });

    if (existingAdmin) {
      return errorResponse(res, ADMIN_ACCOUNT_ALREADY_EXISTS);
    }

    const newAdmin = new AdminSchema({
      email,
      password: await EncryptPassword(password),
      name,
      role,
      phone,
    });

    const savedAdmin = await newAdmin.save();
    return successResponse(res, ADMIN_ADDED_SUCCESS, savedAdmin);
  } catch (error) {
    console.error(error);
    return errorResponse(res, ADMIN_ADDED_FAILED);
  }
};

const getAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await AdminSchema.findById(id).select("-password");

    if (!admin) {
      return errorResponse(res, "Admin not found");
    }

    return successResponse(res, ADMIN_GETTED_SUCCESS, admin);
  } catch (error) {
    console.error(error);
    return errorResponse(res, ADMIN_GETTED_FAILED);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await AdminSchema.findByIdAndUpdate(id, req.body, { new: true });

    if (!result) {
      return errorResponse(res, "Admin not found");
    }

    return successResponse(res, ADMIN_UPDATED_SUCCESS, result);
  } catch (error) {
    console.error(error);
    return errorResponse(res, ADMIN_UPDATED_FAILED);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await AdminSchema.findByIdAndDelete(id);

    return successResponse(res, ADMIN_DELETED_SUCCESS);
  } catch (error) {
    console.error(error);
    return errorResponse(res, ADMIN_DELETED_FAILED);
  }
};

module.exports = {
  addAdmin,
  getAdmin,
  deleteAdmin,
  updateAdmin,
};
