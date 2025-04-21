const router = require("express").Router();
const { admin_routers, auth_routes, user_router } = require("./routers_import");

router.use("/admin", admin_routers);
router.use("/auth", auth_routes);
router.use("/user", user_router);

module.exports = router;