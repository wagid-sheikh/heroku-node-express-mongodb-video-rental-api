const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const {genreSchema} = require('./genres.js');
const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({
    title: {type: String, required: true, uppercase: true, minlength: 5, maxlength: 128},
    genre: {type: genreSchema,required: true},
    numberInStock: {type: Number, required: true, min: 0, max: 255},
    dailyRentalRate: {type: Number, required: true, min: 0, max: 255}
});
const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = {
      title: Joi.string().min(5).max(128).required(),
      genreId: Joi.objectId().required(), //this is to ensure that genreId passed is valid ObjectId as per mongodb standard, whether its actually a valid objectID in DB collection or not is handled by this validator
      numberInStock: Joi.number(),
      dailyRentalRate: Joi.number()
    };
    return Joi.validate(movie, schema);
}
module.exports.movieSchema = movieSchema;
module.exports.Movie = Movie;
module.exports.validate = validateMovie;