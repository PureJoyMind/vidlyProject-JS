const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.post('/', async(req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error);

    let user = await User.findOne({ email: req.body.email });
    // console.log(user);
    if(!user) return res.status(400).send('Invalid email or password.');

    const passMatch = await bcrypt.compare(req.body.password, user.password);
    if(!passMatch) return res.status(400).send('Invalid email or password.');
  
    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send('Logged in successfully.');
});

function validateUser(req){
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router; 