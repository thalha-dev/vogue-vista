const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllIndividuals,
} = require("../controllers/userControllers");

router.get("/getAllUsers", getAllUsers);
router.get("/getAllIndividuals", getAllIndividuals);

module.exports = router;
