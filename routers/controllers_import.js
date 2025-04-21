const { addAdmin, getAdmin, deleteAdmin, updateAdmin } = require("../controllers/admin.controller");
const { login, changePassword, checkLoginStatus } = require("../controllers/auth.controller");
const { addUser, getUsers, getUser } = require("../controllers/user.controller");

module.exports = {
  //admin users
  addAdmin,
  getAdmin,
  deleteAdmin,
  updateAdmin,

  //auth
  login,
  changePassword,
  checkLoginStatus,

  //user
  addUser,
  getUsers,
  getUser,
};
