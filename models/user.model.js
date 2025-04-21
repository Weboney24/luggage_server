const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },

    phone: {
      type: String, 
      required: true,
      trim: true, 
    },

    ticket_id: {
      type: String,
      required: true,
    },

    passport_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "user",
  }
);

module.exports = mongoose.model("User", UserSchema);
