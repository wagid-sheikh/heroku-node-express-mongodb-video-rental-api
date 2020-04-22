const {Rental, validate} = require ('../models/rentals_v1.js');
const {Movie, validateMovie} = require('../models/movies.js');
const {Customer, validateCustomer} = require('../models/customers.js');
const mongoose = require('mongoose');
const asyncMiddleWare = require('../middleware/async.js');
const auth = require('../middleware/auth.js');
const validateObjectId = require('../middleware/validateObjectId.js');
mongoose.set('useFindAndModify', false);

const express = require('express');
const router = express.Router();

router.get('/', auth, asyncMiddleWare(async (req, res) =>{
    const rentals = await Rental.find();
    (rentals.length > 0) ? res.status(200).send(rentals): res.status(404).json('No Records Found');
}));
router.get('/:id', [validateObjectId, auth], asyncMiddleWare(async (req, res) =>{
    const rental = await Rental.findById(req.params.id);
    (rental) ? res.status(200).send(rental): res.status(404).json('No such Record Found');
}));
router.post('/', auth, asyncMiddleWare(async (req, res)=> {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    const customer = await Customer.findById(req.body.customerId);
    if (error) return res.status(400).send('Invalid Customer ID');
    const movie = await Movie.findById(req.body.movieId);
    if (error) return res.status(400).send('Invalid Movie ID');
    let rental = new Rental({
        customer:{_id: customer._id, name: customer.name, phoneNumber: customer.phoneNumber, isGold: customer.isGold},
        movie: {_id: movie._id, title: movie.title, dailyRentalRate: movie.dailyRentalRate, numberInStock: movie.numberInStock, genre: movie.genre}
    });
    rental = await rental.save();
    res.status(200).send('rentals save status=',rental);
}));

module.exports = router;