const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre.js')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    genre: {
        type: genreSchema, 
        required: true
    },

    numberInStock: {
        type: Number,
        default: 0,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        default: 15,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('Movie', movieSchema);

// validating the request
function validateMovie(movie){
    const schema = {
        title: Joi.string().required(),
        genreId: Joi.objeectId().required(),
        numberInStock: Joi.number().min(0),
        dailyRentalRate: Joi.number().min(0)
    };
    return Joi.validate(movie, schema);
}

exports.movieSchema = movieSchema;
exports.Movie = Movie;
exports.validateMovie = validateMovie;
 