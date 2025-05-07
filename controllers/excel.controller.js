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
    const sheet = workbook.Sheets[sheetName];

    const rawData = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    });

    const dataRows = rawData;

    const users = dataRows.map((row) => {
      return {
        barcodeId: row[2]?.toString() || "",
        name: row[5] || "",
        email: "",
        passportId: row[7] || "",
        dataofbirth: row[8] || "",
        dateofissue: row[9] || "",
        dataofexpiry: row[10] || "",
        from: "",
        to: row[1] || "",
        date: "",
        preWeight: row[11] || "",
        Nationality: row[4] || "",
        travel_to: row[1] || "",
        booking_serial: row[2]?.toString() || "",
        nameofothers: row[6] || "",
      };
    });

    const newExcel = await excelModel.create({
      fileName,
      uploadDate,
      fileDetails: {
        originalFileName: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
      },
      users,
    });

    return successResponse(res, ECXEL_SHEET_UPLOAD_SUCESS, newExcel);
  } catch (err) {
    console.error("Excel upload error:", err);
    return errorResponse(res, EXCEL_SHEET_UPLOAD_FAILED);
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
    console.log(result);
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

const get_single_user = async (req, res) => {
  try {
    const barcodId = req.params.id;
    console.log(barcodId);

    const result = await excelModel.aggregate([
      {
        $unwind: "$users",
      },
      {
        $match: { "users.barcodeId": barcodId },
      },
      {
        $project: {
          _id: 0,
          user: "$users",
        },
      },
    ]);
    if (result.length === 0) {
      return errorResponse(res, "User not found");
    }
    console.log(result);
    successResponse(res, "Check Your Details", result);
  } catch (err) {
    console.log(err);
    errorResponse(res, "Check Your Id Number");
  }
};

module.exports = {
  add_excel,
  get_excel,
  edit_excel,
  delete_excel,
  get_single_user,
};
