const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    shoeName: {
      type: String,
      required: true,
      trim: true,
    },

    shoePrice: {
      type: Number,
      required: true,
    },

    shoesAvailable: {
      type: Number,
      required: true,
    },

    shoeSize: {
      type: Number,
      required: true,
    },

    shoeColor: {
      type: String,
      required: true,
      trim: true,
    },

    shoeRating: {
      type: String,
      required: true,
      trim: true,
    },

    shoeReviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        review: {
          type: String,
          trim: true,
        },
      },
    ],

    shoeImages: [
      {
        imageUrl: {
          type: String,
          trim: true,
        },
        imageId: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
