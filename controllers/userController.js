const User = require("../models/user");
const Car = require("../models/car");
const LocalCar = require("../models/localCar");
const InternationalCar = require("../models/internationalCar");
const Rdv = require("../models/rdv");

// GET /:userId
const getInfo = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("cars");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /:userId/car
const createCar = async (req, res) => {
  const { carType, ...carData } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let car;

    if (carType === "LocalCar") {
      car = new LocalCar({ ...carData, userId: user._id });
    } else if (carType === "InternationalCar") {
      car = new InternationalCar({ ...carData, userId: user._id });
    } else {
      return res.status(400).json({ message: "Invalid car type" });
    }

    await car.save();
    user.cars.push(car._id);
    await user.save();

    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /:userId/cars
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.params.userId });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /:userId/:carId/rdv
const createRDV = async (req, res) => {
  const { date, location, service } = req.body;

  try {
    const car = await Car.findOne({
      _id: req.params.carId,
      userId: req.params.userId,
    });
    if (!car) return res.status(404).json({ message: "Car not found" });

    const rdv = new Rdv({
      carId: car._id,
      date,
      location,
      service,
    });

    await rdv.save();

    car.rdvs.push(rdv._id);
    await car.save();

    res.status(201).json(rdv);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /:userId/:carId/:rdvId
const editRDV = async (req, res) => {
  const { date, location, service, status } = req.body;

  try {
    const rdv = await Rdv.findOne({
      _id: req.params.rdvId,
      carId: req.params.carId,
    });

    if (!rdv) return res.status(404).json({ message: "RDV not found" });

    if (date) rdv.date = date;
    if (location) rdv.location = location;
    if (service) rdv.service = service;
    if (status) rdv.status = status;

    await rdv.save();

    res.json(rdv);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /:userId/rdv
const getAllRDV = async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.params.userId });
    const carIds = cars.map((car) => car._id);

    const rdvs = await Rdv.find({ carId: { $in: carIds } }).sort({ date: 1 });

    res.json(rdvs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getInfo,
  createCar,
  getAllCars,
  createRDV,
  editRDV,
  getAllRDV,
};
