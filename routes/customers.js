const auth = require('../middleware/auth.js');
const admin = require('../middleware/admin.js');
const asyncMiddleWare = require('../middleware/async.js');
const validateObjectId = require('../middleware/validateObjectId.js');
const {Customer, validate} = require('../models/customers.js');
const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();

router.get('/', auth, asyncMiddleWare(async (req, res) =>{
    const customer = await Customer.find().sort({name: 1});
    (customer.length > 0) ? res.status(200).send(customer): res.status(404).json('No Records Found');
}));
router.get('/:id', [auth, validateObjectId], asyncMiddleWare(async (req, res) =>{
    const customer = await Customer.findById(req.params.id);
    (customer) ? res.status(200).send(customer): res.status(404).json('No such Record Found');
}));
router.post('/', auth, asyncMiddleWare(async (req, res)=> {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    let customer = new Customer({name: req.body.name, isGold: req.body.isGold, phoneNumber: req.body.phoneNumber});
    customer = await customer.save();
    res.status(200).send(customer);
}));
router.put('/:id', [auth, validateObjectId], asyncMiddleWare(async (req, res)=> {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    const result = await Customer.findByIdAndUpdate(req.params.id, {name: req.body.name, isGold: req.body.isGold, phoneNumber: req.body.phoneNumber}, {new: true});
    res.status(200).send(result);
}));
router.delete('/:id', [auth, admin, validateObjectId], asyncMiddleWare(async (req, res)=> {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    res.status(200).send(customer);
}));
module.exports = router;