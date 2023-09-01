const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadMiddleware = multer();

const {
  uploadNewShoe,
  getAllShoes,
  updateShoeDetails,
} = require("../controllers/productControllers");

router.post(
  "/uploadNewShoe",
  uploadMiddleware.array("shoeImages"),
  uploadNewShoe,
);

router.get("/getAllShoes", getAllShoes);

router.put(
  "/updateShoeDetails",
  uploadMiddleware.array("shoeImages"),
  updateShoeDetails,
);

module.exports = router;
