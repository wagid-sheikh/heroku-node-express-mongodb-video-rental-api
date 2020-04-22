const auth = require('../middleware/auth.js');
const asyncMiddleWare = require('../middleware/async.js');
const validateObjectId = require('../middleware/validateObjectId.js');
const {Rental_V2, validate} = require('../models/rentals_v2.js');
const {Movie} = require('../models/movies.js');
const {Customer} = require('../models/customers.js');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);
router.get('/', auth, asyncMiddleWare(async (req, res) => {
    const rentals = await Rental_V2.find();
    res.send(rentals);
}));

router.post('/', auth, asyncMiddleWare(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in Stock');

    let  rental_v2 = new Rental_V2 ({
        customer: {_id: customer._id, name: customer.name, phoneNumber: customer.phoneNumber, isGold: customer.isGold},
        movie: {_id: movie._id, title: movie.title, dailyRentalRate: movie.dailyRentalRate}
    });
    /* 
    1. here in this following 4 lines of code we are performing 
    two database transactions (rental_v2.save() and movie.save().
    2. For some reason one might fail and in that case our database
    will not be in consistent state. 
    3. Hence we need to implement mongodb two phase commit.
    4. mongodb two phase commit is implemented by npm package fawn
    5. To implement fawn, we don't perform direct DB transaction
    6. We create a task of fawn and that task of fawn does the needful
    */
    /* normal code of lines in normal scenario
    rental_v2 = await rental_v2.save();
    movie.numberInStock--;
    movie.save();
    */
    new Fawn.Task()
        .save('Rental_V2', rental_v2)
        .update('movies', {_id: movie._id}, {$inc: { numberInStock: -1}})
        .run();
    res.status(200).send(rental_v2);
}));

router.get('/:id', [validateObjectId, auth], asyncMiddleWare(async (req, res) => {
    const rental_v2 = await Rental_V2.findById(req.params.id);
    if (!rental_v2) return res.status(400).send('The rental with the given ID was not found.');
    res.status(200).send(rental_v2);
}));

module.exports = router;