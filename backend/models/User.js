const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      select: false,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },

    refreshToken: {
      type: String,
    },

    shoesOwned: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    roles: {
      User: {
        type: Number,
      },
      Admin: {
        type: Number,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
