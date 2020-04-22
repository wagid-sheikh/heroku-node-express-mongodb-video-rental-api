const Joi = require('joi');
const mongoose = require('mongoose');
const genreSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 5, maxlength: 128}
});
const Genre = mongoose.model('Genre', genreSchema);
function validateGenre(customer) {
    const schema = {
      name: Joi.string().min(5).max(128).required()
    };
    return Joi.validate(customer, schema);
}
module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validateGenre;