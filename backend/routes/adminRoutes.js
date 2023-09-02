const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllIndividuals,
  deleteIndividualAccount,
} = require("../controllers/userControllers");

router.get("/getAllUsers", getAllUsers);
router.get("/getAllIndividuals", getAllIndividuals);
router.post("/deleteIndividualAccount", deleteIndividualAccount);

module.exports = router;
