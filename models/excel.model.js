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
        dataofbirth: String,
        dateofissue: String,
        dataofexpiry: String,
        from: String,
        to: String,
        date: String,
        preWeight: String,
        Nationality: String,
        travel_to: String,
        booking_serial: String,
        nameofothers: String,
      },
    ],
  },
  {
    collection: "excel_files",
    timestamps: true,
  }
);

module.exports = mongoose.model("ExcelSheet", ExcelSheetSchema);
