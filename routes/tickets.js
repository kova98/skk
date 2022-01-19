const express = require('express');
const Joi = require('joi');
const router = express.Router();
const db = require('../db/tickets');
const auth = require("../middleware/auth");

// Get all purchased tickets for user
router.get('/', auth, async (req, res) => {
  const tickets = await db.getTickets(req.user.id);
  res.status(200).json({ tickets });
});

// Order a ticket
router.post('/:tripId', auth, async (req, res) => {
  const { error } = validateTicket(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  const response = await db.ticketsLeft(req.params.tripId)
  if (response.tickets_left !== null && response.tickets_left <= 0) 
    return res.status(400).send("No tickets available");
  
  const trxSuccessful = validateTransaction(req.body); 
  if (!trxSuccessful) return res.status(400).send("Error processing transaction");

  const ticket = {
    trip_id: req.params.tripId,
    user_id: req.user.id
  };

  const results = await db.createTicket(ticket);
  res.status(201).json( { id: results[0]});
});

// Cancel a ticket
router.delete('/:id', auth, async (req, res) => {
  const id = parseInt(req.params.id);

  const ticket = await db.getTicket(id);
  if (!ticket) return res.status(404).send('The ticket with the given ID was not found.');

  if (tooLateToCancel(ticket)) 
    return res.status(404).send('You can only cancel for up to 1 hour before departure');

  await db.deleteTicket(id);
  res.status(204).send();
});

function validateTransaction(genre) {
  // Actual card transaction code goes here
  return true;
}

function validateTicket(ticket) {
  const schema = Joi.object({
    cardNumber: Joi.string().required().creditCard(),
    expDate: Joi.date().required(),
    cardCVV: Joi.string().required()
  });

  return schema.validate(ticket);
}

function tooLateToCancel(ticket) {
  const hourBeforeDeparture = new Date(ticket.departure_date) - (1*60*60*1000);
  const now = new Date();
  return now > hourBeforeDeparture;
}

module.exports = router;