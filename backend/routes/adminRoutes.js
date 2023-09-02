const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllIndividuals,
  deleteIndividualAccount,
} = require("../controllers/userControllers");

const verifyJWT = require("../middlewares/auth/verifyJWT");

router.get("/getAllUsers", verifyJWT, getAllUsers);
router.get("/getAllIndividuals", verifyJWT, getAllIndividuals);
router.post("/deleteIndividualAccount", verifyJWT, deleteIndividualAccount);

module.exports = router;
