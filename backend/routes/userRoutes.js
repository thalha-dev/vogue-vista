const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  refreshAccessToken,
  getAllUsers,
  getAllIndividuals,
  deleteIndividualAccount,
} = require("../controllers/userControllers");

const verifyJWT = require("../middlewares/auth/verifyJWT");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refreshAccessToken", refreshAccessToken);

// admin routes

router.get("/getAllUsers", verifyJWT, getAllUsers);
router.get("/getAllIndividuals", verifyJWT, getAllIndividuals);
router.post("/deleteIndividualAccount", verifyJWT, deleteIndividualAccount);

module.exports = router;
