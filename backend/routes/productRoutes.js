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

router.get("/getAllShoes", verifyJWT, getAllShoes);

// admin routes

router.post(
  "/uploadNewShoe",
  verifyJWT,
  uploadMiddleware.array("shoeImages"),
  uploadNewShoe,
);

router.put(
  "/updateShoeDetails",
  verifyJWT,
  uploadMiddleware.array("shoeImages"),
  updateShoeDetails,
);

router.delete("/deleteShoe", verifyJWT, deleteShoe);

module.exports = router;
