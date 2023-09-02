const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cartItems: [
      {
        shoe: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        shoeCount: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);
