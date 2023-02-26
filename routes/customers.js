const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {validatecustomer, Customer} = require('../models/customer');


router.get('/', async (req, res) => {
    const customers = await Customer
        .find()
        .sort({name: 1});

    console.log("get customers");
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if(!customer) return res.status(404).send('No customer with the given ID.'); 
    
    console.log(`get customer with id: ${req.params.id}`);
    res.send(customer);
});



router.post('/', async (req, res) => {
    const { error } = validatecustomer(req.body);
    if(error){
        res.status(400).send(error);
        return;
    }

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone
    });

    await customer.save();

    console.log(`post customer with id: ${customer._id}`);
    res.send(customer);
    
});

router.put('/:id', async(req, res) => {
    // console.log(typeof(req.body.customer));
    // request body validation
    const { error } = validatecustomer(req.body);
    if(error) return res.status(400).send(error);
    
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {new: true});
    
    // checking if the customer9request parameter) exists
    if(!customer) return res.status(404).send('customer not found!');
    
    
    
    // console.log(customer.name);
    // console.log(req.body.name);
    console.log(`put customer with id: ${customer._id}`);
    res.send(customer);
});

router.delete('/:id', async(req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if(!customer) return res.status(404).send('customer not found!');

    console.log(`put customer with id: ${customer._id}`);
    res.send(customer);
});


module.exports = router;