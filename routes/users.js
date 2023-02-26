const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');


router.post('/', async(req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error);

    let user = await User.findOne({ email: req.body.email });
    console.log(user);
    if(user) return res.status(400).send('A user with this email already exists.');

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
    // Hashing the user password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    // To keep the user logged in after registration
    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
});

// router.get('/', async(req, res) => {
//     const users = await User.find().sort({name: 1});
//     let userss = [];
//     _.forEach(users, (user) => { userss.push( _.pick( user, ['name', 'email'] ) ) });
//     res.send(userss);
// });

router.get('/me', auth, async(req, res) => {
    const user = await User.findById(req.user._id).select('-password');

    res.send(user);
});

 

module.exports = router;