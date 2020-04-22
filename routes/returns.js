const auth = require('../middleware/auth.js');
const asyncMiddleWare = require('../middleware/async.js');
const {Rental_V2, validate} = require('../models/rentals_v2.js');
const {validateReturns} = require('../models/returns.js');
const {Movie} = require('../models/movies.js');
const {Customer} = require('../models/customers.js');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', auth, asyncMiddleWare(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(new Error(error.details[0].message));
    const rental = await Rental_V2.findOne({'customer._id': req.body.customerId, 'movie._id': req.body.movieId});
    if (!rental) return res.status(404).send(new Error('No Rental Found.'));
    if (rental.dateReturned) res.status(400).send(new Error('Rental already processed'));
    rental.dateReturned = new Date();
    const date1 = rental.dateOut;
    const date2 = rental.dateReturned;
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var rentalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    const updatedRentalFee = (rentalDays * rental.movie.dailyRentalRate);
    rental.rentalFee = (rentalDays * rental.movie.dailyRentalRate);
    const rentalSaveStatus = await rental.save();
    const movie = await Movie.findById(rental.movie._id);
    movie.numberInStock = movie.numberInStock + 1;
    const movieUpdateStatus = await movie.save();
    
    return res.status(200).send(rental);
}));


module.exports = router;
