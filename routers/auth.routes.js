const { VerfiyToken } = require("../middleware/token.middleware");
const { login, changePassword, checkLoginStatus } = require("../routers/controllers_import");
const router = require("express").Router();

router.post("/login", login);
router.post("/change_password", VerfiyToken, changePassword);
router.get("/check_login", VerfiyToken, checkLoginStatus);

module.exports = router;
