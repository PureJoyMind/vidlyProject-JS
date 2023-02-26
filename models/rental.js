const Joi = require('joi');
const mongoose = require('mongoose');
const {movieSchema} = require('./movie');

const rentalSchema = new mongoose.Schema({
    customer: {
        // We define a custom schema instead of re-using customer schema
        // This is because a customer can have 50 properties and we don't need all those
        type: new mongoose.Schema({
            name:{
                type: String,
                required: true,
                minlength: 3,
                maxlength: 32
            },
            phone: {
                type: String,
                required: true,
                minlength: 5
            },
            isGold: {
                type: Boolean,
                default: false
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 3,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                default: 0,
                min: 0,
                max: 255
            }
        }),
        required: true,
    },
    dateOut:{
        type: Date,
        required: true,
        default: Date.now
    },
    dateRturned: {
        type: Date
    },
    rentalFee:{
        type: Number,
        default: 15, // minimum daily fee
        min: 0
    }
});


const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };
    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validateRental = validateRental;