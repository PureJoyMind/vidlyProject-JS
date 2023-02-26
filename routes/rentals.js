const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const { Rental, validateRental } = require('../models/rental');


router.get('/', async (req, res) => {
    const rentals = await Rental
        .find()
        .sort('-dateOut');// sort in a descending order based on dateOut

    // console.log(typeof(rentals));

    console.log("get rentals");
    res.send(rentals);
});

// router.get('/:id', async (req, res) => {
//     const rental = await Rental.findById(req.params.id);

//     if(!rental) return res.status(404).send('No rental with the given ID.'); 
    
//     console.log(`get rental with id: ${req.params.id}`);
//     res.send(rental);
// });


// Request format:
// { customerId , movieId  }
router.post('/', async (req, res) => {
    const { error } = validateRental(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer!');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie!');

    if(movie.numberInStock === 0) return res.status(400).send('Movie is not in stock!');

    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone:customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    });

    rental = await rental.save();

    movie.numberInStock--;
    await movie.save();

    console.log(`post rental with id: ${rental._id}`);
    res.send(rental);
});

// router.put('/:id', async(req, res) => {
//     // console.log(typeof(req.body.rental));
//     // request body validation
//     const { error } = validateRental(req.body);
//     if(error) return res.status(400).send(error);
    
//     const rental = await Rental.findByIdAndUpdate(req.params.id, { title: req.body.title }, {new: true});
    
//     // checking if the rental9request parameter) exists
//     if(!rental) return res.status(404).send('rental not found!');
    
    
    
//     // console.log(rental.title);
//     // console.log(req.body.title);
//     console.log(`put rental with id: ${rental._id}`);
//     res.send(rental);
// });

router.delete('/:id', async(req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id);

    if(!rental) return res.status(404).send('rental not found!');

    console.log(`delete rental with id: ${rental._id}`);
    res.send(rental);
});


module.exports = router;