const Joi = require("joi");
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
});

const Customer = mongoose.model("Customer", customerSchema);



function validatecustomer(customer){
    const schema = {
        name: Joi.string().required(),
        phone: Joi.string().required(),
        isGold: Joi.boolean()
    };
    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validatecustomer = validatecustomer;