const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadMiddleware = multer();

const {
  uploadNewShoe,
  getAllShoes,
  getSingleShoe,
  updateShoeDetails,
  deleteShoe,
  addToCart,
  removeFromCart,
  getAllShoesFromCart,
} = require("../controllers/productControllers");

const verifyJWT = require("../middlewares/auth/verifyJWT");
const verifyRoles = require("../middlewares/auth/verifyRoles");
const ROLES_LIST = require("../config/roles_list");

router.get("/getAllShoes", verifyJWT, getAllShoes);
router.get("/getAllShoesFromCart/:userId", verifyJWT, getAllShoesFromCart);
router.get("/getSingleShoe/:shoeId", verifyJWT, getSingleShoe);
router.post("/addToCart", verifyJWT, addToCart);
router.post("/removeFromCart", verifyJWT, removeFromCart);

// admin routes

router.post(
  "/uploadNewShoe",
  verifyJWT,
  verifyRoles(ROLES_LIST.Admin),
  uploadMiddleware.array("shoeImages"),
  uploadNewShoe,
);

router.put(
  "/updateShoeDetails",
  verifyJWT,
  verifyRoles(ROLES_LIST.Admin),
  uploadMiddleware.array("shoeImages"),
  updateShoeDetails,
);

router.delete(
  "/deleteShoe",
  verifyJWT,
  verifyRoles(ROLES_LIST.Admin),
  deleteShoe,
);

module.exports = router;
