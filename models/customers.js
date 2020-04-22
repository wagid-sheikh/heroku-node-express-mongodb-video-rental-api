const Joi = require('joi');
const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
    name: {type: String, required: true, uppercase: true, minlength: 5, maxlength: 128},
    isGold: {type: Boolean, required: true},
    phoneNumber: {type: String, required: true, minlength: 10, maxlength: 12}
});
const Customer = mongoose.model('Customer', customerSchema);
function validateCustomer(customer) {
    const schema = {
      name: Joi.string().min(5).max(128).required(),
      phoneNumber: Joi.string().min(10).max(12).required(),
      isGold: Joi.boolean()
    };
    return Joi.validate(customer, schema);
}
module.exports.customerSchema = customerSchema;
module.exports.Customer = Customer;
module.exports.validate = validateCustomer;