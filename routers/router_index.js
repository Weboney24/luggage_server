const router = require("express").Router();
const { admin_routers, auth_routes, user_router, excel_routes } = require("./routers_import");

router.use("/admin", admin_routers);
router.use("/auth", auth_routes);
router.use("/user", user_router);
router.use("/excel", excel_routes);
module.exports = router;
