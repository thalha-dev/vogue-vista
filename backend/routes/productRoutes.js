const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadMiddleware = multer();

const { uploadNewShoe } = require("../controllers/productControllers");

router.post(
  "/uploadNewShoe",
  uploadMiddleware.array("shoeImages"),
  uploadNewShoe,
);

module.exports = router;
