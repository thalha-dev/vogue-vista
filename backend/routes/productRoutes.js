const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadMiddleware = multer();

const {
  uploadNewShoe,
  getAllShoes,
} = require("../controllers/productControllers");

router.post(
  "/uploadNewShoe",
  uploadMiddleware.array("shoeImages"),
  uploadNewShoe,
);

router.get("/getAllShoes", getAllShoes);

module.exports = router;
