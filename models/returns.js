const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

function validateReturns(rental){
    const schema = {
        customerId: Joi.objectId().required(),//this is to ensure that customerId passed is valid ObjectId as per mongodb standard, whether its actually a valid objectID in DB collection or not is handled by this validator
        movieId: Joi.objectId().required(),//this is to ensure that movieId passed is valid ObjectId as per mongodb standard, whether its actually a valid objectID in DB collection or not is handled by this validator
    };
    return Joi.validate(rental, schema);
}

module.exports.validateReturns = validateReturns;