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
const verifyRoles = require("../middlewares/auth/verifyRoles");
const ROLES_LIST = require("../config/roles_list");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refreshAccessToken", refreshAccessToken);

// admin routes

router.get(
  "/getAllUsers",
  verifyJWT,
  verifyRoles(ROLES_LIST.Admin),
  getAllUsers,
);

router.get(
  "/getAllIndividuals",
  verifyJWT,
  verifyRoles(ROLES_LIST.Admin),
  getAllIndividuals,
);

router.post(
  "/deleteIndividualAccount",
  verifyJWT,
  verifyRoles(ROLES_LIST.Admin),
  deleteIndividualAccount,
);

module.exports = router;
