const { mongoose } = require("mongoose");

const FileDetailsSchema = new mongoose.Schema(
  {
    originalFileName: String,
    type: String,
    size: Number,
  },
  { _id: false }
);

const ExcelSheetSchema = new mongoose.Schema(
  {
    fileName: String,
    uploadDate: String,
    fileDetails: FileDetailsSchema,
    users: [
      {
        barcodeId: String,
        name: String,
        email: String,
        passportId: String,
        from: String,
        to: String,
        date: String,
        preWeight: String,
      },
    ],
  },
  {
    collection: "excel_files",
    timestamps: true,
  }
);

module.exports = mongoose.model("ExcelSheet", ExcelSheetSchema);
