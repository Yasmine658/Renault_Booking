const express = require("express");
const {
  getInfo,
  createCar,
  getAllCars,
  createRDV,
  editRDV,
  getAllRDV,
} = require("../controllers/userController");

const router = express.Router();

router.get("/:userId", getInfo);
router.post("/:userId/car", createCar);
router.get("/:userId/cars", getAllCars);
router.post("/:userId/:carId/rdv", createRDV);
router.put("/:userId/:carId/:rdvId", editRDV);
router.get("/:userId/rdv", getAllRDV);

module.exports = router;
