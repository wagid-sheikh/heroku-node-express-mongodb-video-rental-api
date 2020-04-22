const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const {movieSchema} = require('./movies.js');
const {customerSchema} = require('./customers.js');
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    customer: { type: customerSchema, required: true},
    movie: {type: movieSchema, required: true},
    dateRented: {type: Date, required: true, default: Date.now},
    dateReturned: {type: Date, default: null},
    totalRental: {type: Number, min: 0, max: 10000, default: 0}
});
const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
    const schema = {
      customerId: Joi.objectId().required(),//this is to ensure that genreId passed is valid ObjectId as per mongodb standard, whether its actually a valid objectID in DB collection or not is handled by this validator
      movieId: Joi.objectId().required(),//this is to ensure that genreId passed is valid ObjectId as per mongodb standard, whether its actually a valid objectID in DB collection or not is handled by this validator
      dateRented: Joi.date(),
      dateReturned: Joi.date(),
      totalRental: Joi.number(),
    };
    return Joi.validate(rental, schema);
}
module.exports.rentalSchema = rentalSchema;
module.exports.Rental = Rental;
module.exports.validate = validateRental;