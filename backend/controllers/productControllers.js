const createHttpError = require("http-errors");
const ProductModel = require("../models/Product");
const imagekit = require("../config/imagekitConf");

// function to upload a new shoe to product collection
const uploadNewShoe = async (req, res, next) => {
  const shoeName = req.body.shoeName;
  const shoeBrand = req.body.shoeBrand;
  const shoePrice = req.body.shoePrice;
  const shoeSize = req.body.shoeSize;
  const shoeColor = req.body.shoeColor;
  const shoesAvailable = req.body.shoesAvailable;
  const shoeRating = req.body.shoeRating;
  const imageFiles = req.files;
  try {
    // checking for availability

    if (!shoeName) {
      throw createHttpError(400, "Shoe name not given");
    }

    if (!shoeBrand) {
      throw createHttpError(400, "Shoe name not given");
    }

    if (!shoePrice) {
      throw createHttpError(400, "Shoe price not given");
    }

    if (!shoeSize) {
      throw createHttpError(400, "Shoe size not given");
    }

    if (!shoeColor) {
      throw createHttpError(400, "Shoe color not given");
    }

    if (!shoesAvailable) {
      throw createHttpError(400, "Shoe available count not given");
    }

    if (!shoeRating) {
      throw createHttpError(400, "Shoe old rating not given");
    }

    if (!imageFiles.length) {
      throw createHttpError(400, "Shoe images are not given");
    }

    // array of objects containing image url and id from imagekit
    const imageArray = [];

    // uploading images and generating URL
    for (let i = 0; i < imageFiles.length; i++) {
      const image = await imagekit.upload({
        file: imageFiles[i].buffer,
        fileName: imageFiles[i].originalname,
        folder: "/products",
      });

      const imageUrl = imagekit.url({
        path: image.filePath,
      });
      const imageInfo = {
        imageUrl,
        imageId: image.fileId,
      };
      imageArray.push(imageInfo);
    }

    // saving in db
    const newProduct = await ProductModel.create({
      shoeName: shoeName,
      shoeBrand: shoeBrand,
      shoePrice: Number(shoePrice),
      shoesAvailable: Number(shoesAvailable),
      shoeSize: Number(shoeSize),
      shoeColor: shoeColor,
      shoeRating: Number(shoeRating),
      shoeImages: imageArray,
    });

    res.status(200).json({ newProduct });
  } catch (error) {
    next(error);
  }
};

const getAllShoes = async (req, res, next) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 }).exec();
    if (!products) {
      throw createHttpError(404, "No products exists");
    }

    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadNewShoe,
  getAllShoes,
};
