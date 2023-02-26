const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const app = express();
const config = require('config');

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://localhost:27017/vidly')
    .then( () => console.log('connected to vidly DB...') )
    .catch( err => console.error('could\'nt connect to DB', err));


// to use json
app.use(express.json());

app.get('/', (req, res) => {
    return res.status("200").send({success: true});
});

// to use routes
app.use('/vidly/genres', genres);
app.use('/vidly/customers', customers);
app.use('/vidly/movies', movies);
app.use('/vidly/rentals', rentals);
app.use('/vidly/users', users);
app.use('/vidly/auth', auth);




const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));