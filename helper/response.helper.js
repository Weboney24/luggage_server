const { SOMETHING_WENT_WRONG } = require("../helper/message.helper");

// Success response
const successResponse = (res, message = "", data = []) => {
  return res.status(200).json({ success: true, message, data });
};

// Error response
const errorResponse = (res, message = SOMETHING_WENT_WRONG) => {
  return res.status(500).json({ success: false, message });
};

module.exports = { successResponse, errorResponse };
