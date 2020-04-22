const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const Rental_V2 = mongoose.model('Rental_V2', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {type: String, required: true, uppercase: true, minlength: 5, maxlength: 128},
            isGold: {type: Boolean, default: false},
            phoneNumber: {type: String, required: true, minlength: 10, maxlength: 12}
        }), required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {type: String, required: true, minlength: 5, maxlength: 128},
            dailyRentalRate: {type: Number, required: true, min:0, max: 255}
        }), required: true
    },
    dateOut:{ type: Date, required: true, default: Date.now},
    dateReturned: {type: Date},
    rentalFee: {type: Number, min: 0}
}),'Rental_V2');

function validateRental(rental){
    const schema = {
        customerId: Joi.objectId().required(),//this is to ensure that genreId passed is valid ObjectId as per mongodb standard, whether its actually a valid objectID in DB collection or not is handled by this validator
        movieId: Joi.objectId().required(),//this is to ensure that genreId passed is valid ObjectId as per mongodb standard, whether its actually a valid objectID in DB collection or not is handled by this validator
    };
    return Joi.validate(rental, schema);
}

module.exports.Rental_V2 = Rental_V2;
module.exports.validate = validateRental;