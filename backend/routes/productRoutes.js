const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadMiddleware = multer();

const {
  uploadNewShoe,
  getAllShoes,
  updateShoeDetails,
  deleteShoe,
} = require("../controllers/productControllers");

const verifyJWT = require("../middlewares/auth/verifyJWT");

router.post(
  "/uploadNewShoe",
  verifyJWT,
  uploadMiddleware.array("shoeImages"),
  uploadNewShoe,
);

router.get("/getAllShoes", verifyJWT, getAllShoes);

router.put(
  "/updateShoeDetails",
  verifyJWT,
  uploadMiddleware.array("shoeImages"),
  updateShoeDetails,
);

router.delete("/deleteShoe", verifyJWT, deleteShoe);

module.exports = router;
