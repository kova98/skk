const express = require('express');
const Joi = require('joi');
const router = express.Router();
const db = require('../db/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

// Authenticate a user
router.post('/', async (req, res) => {
  const { error } = validateReq(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const user = await db.getUserByEmail(req.body.email);
  if (!user) return res.status(400).send("Invalid email or password");

  const passwordValid = await bcrypt.compare(req.body.password, user.password);
  if (!passwordValid) return res.status(400).send("Invalid email or password");

  const token = jwt.sign({ id : user.id}, process.env.JWT_KEY);

  res.status(200).send(token);
});

function validateReq(req) {
  const schema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
  });

  return schema.validate(req);
}

module.exports = router;