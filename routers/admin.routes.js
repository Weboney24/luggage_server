const { addAdmin, getAdmin, deleteAdmin, updateAdmin } = require("./controllers_import");
const router = require("express").Router();
const { VerfiyToken } = require("../middleware/token.middleware");

router.post("/add_admin", addAdmin);
router.get("/get_admin/:id", VerfiyToken, getAdmin);
router.put("/update_admin/:id", VerfiyToken, updateAdmin);
router.delete("/delete_admin/:id", VerfiyToken, deleteAdmin);

module.exports = router;
