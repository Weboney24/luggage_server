// routes/excelRoutes.js
const express = require("express");
const multer = require("multer");
const { add_excel } = require("./controllers_import");
const { get_excel, edit_excel, delete_excel } = require("../controllers/excel.controller");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/add_excel_sheet", upload.single("excelFile"), add_excel);
router.get("/get_excel_sheet", get_excel);
router.put("/edit_excel_sheet/:id", upload.single("excelFile"), edit_excel);
router.delete("/delete_excel_sheet/:id", delete_excel);

module.exports = router;
