const express = require('express');
const Joi = require('joi');
const router = express.Router();
const db = require('../db/trips');
const auth = require("../middleware/auth");

// Get all trips 
router.get('/', async (req, res) => {
  const trips = await db.getTrips();
  res.status(200).json({ trips: trips });
});

// Create a trip
router.post('/', auth, async (req, res) => {
  const { error } = validateTrip(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const trip = {
    carrier_name: req.body.carrierName,
    departure_date: req.body.departureDate,
    arrival_date: req.body.arrivalDate,
    max_tickets: req.body.maxTickets,
  };

  const results = await db.createTrip(trip);
  res.status(201).json( { id: results[0]});
});

function validateTrip(trip) {
  const schema = Joi.object({
    carrierName: Joi.string().min(3).required(),
    departureDate: Joi.date().required(),
    arrivalDate: Joi.date().required(),
    maxTickets: Joi.number().required(),
  });

  return schema.validate(trip);
}

module.exports = router;