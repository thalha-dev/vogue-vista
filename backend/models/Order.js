const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    productsInOrder: [
      {
        shoe: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        shoeCount: {
          type: Number,
        },
      },
    ],

    orderPrice: {
      type: Number,
      required: true,
    },

    payment_intent: {
      type: String,
      required: true,
    },

    isOrderCompleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
