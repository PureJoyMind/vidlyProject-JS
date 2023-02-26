const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const {Genre, validateGenre} = require('../models/genre');


router.get('/', async (req, res) => {
    const genres = await Genre
        .find()
        .sort({name: 1});

    // console.log(typeof(genres));

    console.log("get genres");
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if(!genre) return res.status(404).send('No genre with the given ID.'); 
    
    console.log(`get genre with id: ${req.params.id}`);
    res.send(genre);
});



router.post('/', auth, async (req, res) => {
    const { error } = validateGenre(req.body);
    if(error){
        res.status(400).send(error);
        return;
    }

    const genre = new Genre({
        name: req.body.name
    });

    await genre.save();

    console.log(`post genre with id: ${genre._id}`);
    res.send(genre);
    
});

router.put('/:id', [auth, admin], async(req, res) => {
    // console.log(typeof(req.body.genre));
    // request body validation
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error);
    
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name}, {new: true});
    
    // checking if the genre9request parameter) exists
    if(!genre) return res.status(404).send('genre not found!');
    
    
    
    // console.log(genre.name);
    // console.log(req.body.name);
    console.log(`put genre with id: ${genre._id}`);
    res.send(genre);
});

router.delete('/:id', [auth, admin], async(req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if(!genre) return res.status(404).send('genre not found!');

    console.log(`delete genre with id: ${genre._id}`);
    res.send(genre);
});


module.exports = router;