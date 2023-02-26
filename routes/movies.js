const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {Movie, validateMovie} = require('../models/movie');
const { Genre } = require('../models/genre');


router.get('/', async (req, res) => {
    const movies = await Movie
        .find()
        .sort({title: 1});

    console.log(typeof(movies));

    console.log("get movies");
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if(!movie) return res.status(404).send('No movie with the given ID.'); 
    
    console.log(`get movie with id: ${req.params.id}`);
    res.send(movie);
});


// Request format:
//{ title: sth, genreId: "hcwuyg2uy4g5243987y", numberInStock: 10, dailyRentalRate: 2}
router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body);
    if(error){
        res.status(400).send(error);
        return;
    }

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Genre invalid!');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();

    console.log(`post movie with id: ${movie._id}`);
    res.send(movie);
    
});

router.put('/:id', async(req, res) => {
    // console.log(typeof(req.body.movie));
    // request body validation
    const { error } = validateMovie(req.body);
    if(error) return res.status(400).send(error);
    
    const movie = await Movie.findByIdAndUpdate(req.params.id, { title: req.body.title }, {new: true});
    
    // checking if the movie9request parameter) exists
    if(!movie) return res.status(404).send('movie not found!');
    
    
    
    // console.log(movie.title);
    // console.log(req.body.title);
    console.log(`put movie with id: ${movie._id}`);
    res.send(movie);
});

router.delete('/:id', async(req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if(!movie) return res.status(404).send('movie not found!');

    console.log(`delete movie with id: ${movie._id}`);
    res.send(movie);
});


module.exports = router;