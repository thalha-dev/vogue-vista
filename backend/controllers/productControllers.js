const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const stripeLibrary = require("stripe");

const ProductModel = require("../models/Product");
const CartModel = require("../models/Cart");
const WishListModel = require("../models/WishList");
const OrderModel = require("../models/Order");
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

    const products = await ProductModel.find({
      shoeName: shoeName,
    }).exec();

    let existingProductIndex = null;
    if (products) {
      for (let i = 0; i < products.length; i++) {
        if (
          products[i].shoeSize === Number(shoeSize) &&
          products[i].shoeColor === shoeColor
        ) {
          existingProductIndex = i;
        }
      }
    }

    if (existingProductIndex || existingProductIndex === 0) {
      products[existingProductIndex].shoesAvailable++;
      await products[existingProductIndex].save();
      res.status(200).json({ newProduct: products[existingProductIndex] });
    } else {
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
    }
  } catch (error) {
    next(error);
  }
};

// middleware to get all shoes from db
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

// middleware to get all shoes from db
const getSingleShoe = async (req, res, next) => {
  const shoeId = req.params.shoeId;
  try {
    if (!shoeId) {
      throw createHttpError(400, "Shoe ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(shoeId)) {
      throw createHttpError(400, "Shoe ID is not in correct format");
    }

    const product = await ProductModel.findOne({ _id: shoeId }).exec();

    if (!product) {
      throw createHttpError(404, "Article not found for the given ID");
    }

    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

// middleware to update an existing shoe details
const updateShoeDetails = async (req, res, next) => {
  const shoeId = req.body.shoeId;
  const shoeName = req.body.shoeName;
  const shoeBrand = req.body.shoeBrand;
  const shoePrice = req.body.shoePrice;
  const shoeSize = req.body.shoeSize;
  const shoeColor = req.body.shoeColor;
  const shoesAvailable = req.body.shoesAvailable;
  const shoeRating = req.body.shoeRating;
  const imageFiles = req.files;
  try {
    if (!shoeId) {
      throw createHttpError(400, "Shoe ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(shoeId)) {
      throw createHttpError(400, "Shoe ID is not in correct format");
    }

    const product = await ProductModel.findOne({ _id: shoeId }).exec();

    if (!product) {
      throw createHttpError(400, "Product not found!");
    }

    if (shoeName) product.shoeName = shoeName;
    if (shoeBrand) product.shoeBrand = shoeBrand;
    if (shoePrice) product.shoePrice = Number(shoePrice);
    if (shoeSize) product.shoeSize = Number(shoeSize);
    if (shoeColor) product.shoeColor = shoeColor;
    if (shoesAvailable) product.shoesAvailable = Number(shoesAvailable);
    if (shoeRating) product.shoeRating = Number(shoeRating);
    if (imageFiles.length) {
      // deleting old images from imagekit server
      product.shoeImages.forEach((ob) => {
        imagekit.deleteFile(ob.imageId);
      });

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

      product.shoeImages = imageArray;
    }

    // save the changes in db
    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// middleware to delete a shoe from db
const deleteShoe = async (req, res, next) => {
  const shoeId = req.body.shoeId;
  try {
    if (!shoeId) {
      throw createHttpError(400, "Shoe ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(shoeId)) {
      throw createHttpError(400, "Shoe ID is not in correct format");
    }

    const deletedProduct = await ProductModel.findOneAndDelete({
      _id: shoeId,
    }).exec();

    if (!deletedProduct) {
      throw createHttpError(400, "Product not found!");
    }

    // deleting product images for imagekit library
    deletedProduct.shoeImages.forEach((ob) => {
      imagekit.deleteFile(ob.imageId);
    });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

// add a single product to cart
const addToCart = async (req, res, next) => {
  const userId = req.body.userId;
  const productId = req.body.productId;

  try {
    if (!userId) {
      throw createHttpError(400, "User Id is not given");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, "User ID is not in correct format");
    }

    if (!productId) {
      throw createHttpError(400, "Product Id is not given");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw createHttpError(400, "Product ID is not in correct format");
    }

    // checking for existing cart
    let userCart = await CartModel.findOne({
      userId: userId,
    }).exec();

    // if not create one for the user
    if (!userCart) {
      userCart = await CartModel.create({
        userId: userId,
      });
    }

    const productExists = await ProductModel.findOne({ _id: productId }).exec();

    if (!productExists) {
      throw createHttpError(400, "Invalid Product ID");
    }

    // add the product id only if doesn't exist before
    let itemExistInCart = false;
    let itemIndex = 0;

    for (let i = 0; i < userCart.cartItems.length; i++) {
      if (userCart.cartItems[i].shoe.toString() === productId) {
        itemExistInCart = true;
        itemIndex = i;
      }
    }

    if (itemExistInCart) {
      if (
        userCart.cartItems[itemIndex].shoeCount < productExists.shoesAvailable
      ) {
        userCart.cartItems[itemIndex].shoeCount++;
      }
    } else {
      userCart.cartItems.push({
        shoe: productId,
        shoeCount: 1,
      });
    }

    await userCart.save();

    res.status(200).json({ userCart });
  } catch (error) {
    next(error);
  }
};

// remove a single product from cart
const removeFromCart = async (req, res, next) => {
  const userId = req.body.userId;
  const productId = req.body.productId;

  try {
    if (!userId) {
      throw createHttpError(400, "User Id is not given");
    }

    if (!productId) {
      throw createHttpError(400, "Product Id is not given");
    }

    // checking for existing cart
    const userCart = await CartModel.findOne({
      userId: userId,
    }).exec();

    if (!userCart) {
      throw createHttpError(400, "Cart not initiated for this user");
    }

    // remove the product id only if does exist before
    let itemExistInCart = false;
    let itemIndex = 0;

    for (let i = 0; i < userCart.cartItems.length; i++) {
      if (userCart.cartItems[i].shoe.toString() === productId) {
        itemExistInCart = true;
        itemIndex = i;
      }
    }

    if (!itemExistInCart) {
      throw createHttpError(400, "Shoe doesn't exist in cart");
    }

    // remove the item if count less than 2 or else decrease the count
    if (userCart.cartItems[itemIndex].shoeCount < 2) {
      userCart.cartItems = userCart.cartItems.filter(
        (o) => o.shoe.toString() !== productId,
      );
    } else {
      userCart.cartItems[itemIndex].shoeCount--;
    }

    await userCart.save();

    res.status(200).json({ userCart });
  } catch (error) {
    next(error);
  }
};

// to get all the shoes saved in the cart
const getAllShoesFromCart = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    // Find the cart and populate the 'shoe' field in 'cartItems'
    const userCart = await CartModel.findOne({
      userId: userId,
    })
      .populate("cartItems.shoe")
      .exec();

    if (!userCart) {
      throw createHttpError(404, "Nothing in the cart");
    }

    for (let i = 0; i < userCart.cartItems.length; i++) {
      if (
        userCart.cartItems[i].shoeCount >
        userCart.cartItems[i].shoe.shoesAvailable
      ) {
        userCart.cartItems[i].shoeCount =
          userCart.cartItems[i].shoe.shoesAvailable;
      }
    }

    await userCart.save();

    res.status(200).json(userCart);
  } catch (error) {
    next(error);
  }
};

// add a single product to cart
const addToWishList = async (req, res, next) => {
  const userId = req.body.userId;
  const productId = req.body.productId;

  try {
    if (!userId) {
      throw createHttpError(400, "User Id is not given");
    }

    if (!productId) {
      throw createHttpError(400, "Product Id is not given");
    }

    // checking for existing wishlist
    let userWishList = await WishListModel.findOne({
      userId: userId,
    }).exec();

    // if not create one for the user
    if (!userWishList) {
      userWishList = await WishListModel.create({
        userId: userId,
      });
    }

    const productExists = await ProductModel.findOne({ _id: productId }).exec();

    if (!productExists) {
      throw createHttpError(400, "Invalid Product ID");
    }

    // add the product id only if doesn't exist before
    if (!userWishList.wishListItems.includes(productId)) {
      userWishList.wishListItems.push(productId);
      await userWishList.save();
    }

    res.status(200).json({ userWishList });
  } catch (error) {
    next(error);
  }
};

// remove a single product from wishlist
const removeFromWishList = async (req, res, next) => {
  const userId = req.body.userId;
  const productId = req.body.productId;

  try {
    if (!userId) {
      throw createHttpError(400, "User Id is not given");
    }

    if (!productId) {
      throw createHttpError(400, "Product Id is not given");
    }

    // checking for existing wishlist
    const userWishList = await WishListModel.findOne({
      userId: userId,
    }).exec();

    if (!userWishList) {
      throw createHttpError(400, "WishList not initiated for this user");
    }

    // remove the product id only if does exist before
    if (userWishList.wishListItems.includes(productId)) {
      console.log("in");
      userWishList.wishListItems = userWishList.wishListItems.filter(
        (elem) => elem.toString() !== productId,
      );
      await userWishList.save();
    }

    res.status(200).json({ userWishList });
  } catch (error) {
    next(error);
  }
};

// to get all the shoes saved in the cart
const getAllShoesFromWishList = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    // Find the cart and populate the 'shoe' field in 'cartItems'
    const userWishList = await WishListModel.findOne({
      userId: userId,
    })
      .populate("wishListItems")
      .exec();

    if (!userWishList) {
      throw createHttpError(404, "Nothing in the cart");
    }

    res.status(200).json(userWishList);
  } catch (error) {
    next(error);
  }
};

const stripePaymentIntent = async (req, res, next) => {
  const id = req.body.id;
  const userId = req.body.userId;
  const orderType = req.body.orderType;
  const deliveryAddress = req.body.deliveryAddress;
  const stripe = stripeLibrary(process.env.STRIPE_SECRET_KEY);

  try {
    if (!id) {
      throw createHttpError(400, "ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, "ID is not in correct format");
    }

    if (!userId) {
      throw createHttpError(400, "User Id is not given");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw createHttpError(400, "User ID is not in correct format");
    }

    if (!orderType) {
      throw createHttpError(400, "Order type is required");
    }

    if (!deliveryAddress) {
      throw createHttpError(400, "Delivery Address is required");
    }

    let price = 0;
    let singleProduct = null;
    let userCart = null;

    if (orderType === "single") {
      // if given id is the product id
      singleProduct = await ProductModel.findOne({
        _id: id,
      }).exec();

      price += Number(singleProduct.shoePrice);
    } else if (orderType === "cart") {
      // if given id is the cart id
      // Find the cart and populate the 'shoe' field in 'cartItems'
      userCart = await CartModel.findOne({
        _id: id,
      })
        .populate("cartItems.shoe")
        .exec();

      for (let i = 0; i < userCart.cartItems.length; i++) {
        if (
          userCart.cartItems[i].shoeCount >
          userCart.cartItems[i].shoe.shoesAvailable
        ) {
          userCart.cartItems[i].shoeCount =
            userCart.cartItems[i].shoe.shoesAvailable;
        }
      }

      await userCart.save();

      // calcucating price
      for (let i = 0; i < userCart.cartItems.length; i++) {
        const sp = Number(userCart.cartItems[i].shoe.shoePrice);
        const count = Number(userCart.cartItems[i].shoeCount);
        price += Number(sp * count);
      }
    }

    // creating payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // to save in order collection
    const productsInOrder = [];

    if (singleProduct) {
      productsInOrder.push({
        shoe: singleProduct._id,
        shoeCount: 1,
      });
    } else if (userCart) {
      for (let i = 0; i < userCart.cartItems.length; i++) {
        const ob = {
          shoe: userCart.cartItems[i].shoe._id,
          shoeCount: Number(userCart.cartItems[i].shoeCount),
        };

        productsInOrder.push(ob);
      }
    }

    const newOrder = new OrderModel({
      userId: userId,
      productsInOrder: productsInOrder,
      orderPrice: price,
      payment_intent: paymentIntent.id,
      deliveryAddress: deliveryAddress,
    });

    await newOrder.save();

    // sending client secret to client
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

const confirmOrder = async (req, res, next) => {
  const paymentIntentId = req.body.paymentIntentId;
  try {
    if (!paymentIntentId) {
      throw createHttpError(400, "Payment intent's ID is required");
    }

    const order = await OrderModel.findOneAndUpdate(
      {
        payment_intent: paymentIntentId,
      },
      {
        $set: {
          isOrderCompleted: true,
        },
      },
    );

    // updating product available count in db
    for (let i = 0; i < order.productsInOrder.length; i++) {
      const product = await ProductModel.findOne({
        _id: order.productsInOrder[i].shoe,
      }).exec();

      if (product.shoesAvailable > 0) {
        product.shoesAvailable = product.shoesAvailable - 1;
      }

      await product.save();
    }

    res.status(200).send("Order Success");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadNewShoe,
  getAllShoes,
  getSingleShoe,
  updateShoeDetails,
  deleteShoe,
  addToCart,
  removeFromCart,
  getAllShoesFromCart,
  addToWishList,
  removeFromWishList,
  getAllShoesFromWishList,
  stripePaymentIntent,
  confirmOrder,
};
