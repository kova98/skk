const express = require('express');
const Joi = require('joi');
const router = express.Router();
const db = require('../db/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

// Get a user
router.get('/:id', async (req, res) => {
    const user = await db.getUser(req.params.id);
    res.status(200).json({ user });
  });

// Register a new user
router.post('/', async (req, res) => {
  const { error } = validateUser(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const users = await db.getUserByEmail(req.body.email);
  if (users) return res.status(400).send(`User with email ${req.body.email} already exists`);

  const salt = await bcrypt.genSalt();
  const hashed = await bcrypt.hash(req.body.password, salt);

  const user = {
    name: req.body.name,
    email: req.body.email, 
    password: hashed, 
    role: "user",
  };

  const results = await db.createUser(user);
  const token = jwt.sign({ id : user.id}, process.env.JWT_KEY);

  res.status(201).header("x-auth-token", token).json({ 
    id: results[0], 
    name: user.name, 
    email: user.email});
});

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    password: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
  });

  return schema.validate(user);
}

module.exports = router;