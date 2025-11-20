// routes/locationRoutes.js
const express = require("express");
const { reverseGeocode } = require("../controllers/locationController");

const locationRouter = express.Router();

locationRouter.get("/reverse-geocode", reverseGeocode);

module.exports = locationRouter;
