const { log } = require("winston");
const excelModel = require("../models/excel.model");
const { successResponse, errorResponse } = require("../helper/response.helper");
const XLSX = require("xlsx");
const { EXCEL_SHEET_UPLOAD_FAILED, EXCEL_SHEET_DELETE_FAILED, EXCEL_SHEET_DELETE_SUCCESS, EXCEL_SHEET_EDIT_SUCCESS, EXCEL_SHEET_EDIT_FAILED, ECXEL_SHEET_UPLOAD_SUCESS } = require("../helper/message.helper");

const add_excel = async (req, res) => {
  try {
    const { fileName, uploadDate } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const newExcel = await excelModel.create({
      fileName,
      uploadDate,
      fileDetails: {
        originalFileName: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
      },
      users: sheetData.map((row) => ({
        barcodeId: row["Reference ID"],
        name: row["User Name"],
        email: row["Email"] || "",
        passportId: row["Passport ID"],
        from: row["From"],
        to: row["To"],
        date: row["Date"],
        preWeight: row["Pre Weight"],
      })),
    });

    successResponse(res, ECXEL_SHEET_UPLOAD_SUCESS, newExcel);
  } catch (err) {
    console.error(err);
    errorResponse(res, EXCEL_SHEET_UPLOAD_FAILED);
  }
};

const get_excel = async (req, res) => {
  try {
    let where = {};
    const result = await excelModel.aggregate([
      {
        $match: where,
      },
    ]);
    successResponse(res, "Get Successs", result);
  } catch (err) {
    errorResponse(res, "Get Failed");
  }
};

const edit_excel = async (req, res) => {
  try {
    const { fileName, uploadDate } = req.body;
    const updateData = { fileName, uploadDate };

    if (req.file) {
      updateData.fileDetails = {
        originalFileName: req.file.originalname,
        filePath: `/uploads/${req.file.filename}`,
        size: req.file.size,
      };
    }

    const result = await excelModel.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });

    successResponse(res, "Excel sheet updated successfully", result);
  } catch (err) {
    console.log(err);
    errorResponse(res, "Failed to update Excel sheet");
  }
};

const delete_excel = async (req, res) => {
  try {
    const result = await excelModel.findByIdAndDelete({ _id: req.params.id });

    successResponse(res, EXCEL_SHEET_DELETE_SUCCESS, result);
  } catch (err) {
    console.log(err);
    errorResponse(res, EXCEL_SHEET_DELETE_FAILED);
  }
};

module.exports = {
  add_excel,
  get_excel,
  edit_excel,
  delete_excel,
};
