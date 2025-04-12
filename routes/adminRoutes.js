const express = require("express");
const {
  createUser,
  getAllUsers,
  getAllRDV,
  changeRDVStatus,
} = require("../controllers/adminController");

const router = express.Router();

router.post("/user", createUser);
router.get("/users", getAllUsers);
router.get("/rdv", getAllRDV);
router.put("/:userId/:carId/:rdvId", changeRDVStatus);

module.exports = router;
