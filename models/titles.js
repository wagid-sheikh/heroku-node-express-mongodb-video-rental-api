const mongoose = require('mongoose');
const Joi = require('joi');
const Title = mongoose.model('Title', 
    new mongoose.Schema({
        name: {type: String, required: true, uppercase: true, minlength: 5, maxlength: 128}
    })
);

function validateTitle(customer) {
    const schema = {
      name: Joi.string().min(5).max(128).required()
    };
    return Joi.validate(customer, schema);
}

module.exports.Title = Title;
module.exports.validate = validateTitle;
