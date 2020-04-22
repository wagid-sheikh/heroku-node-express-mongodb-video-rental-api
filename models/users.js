const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 5, maxlength: 128},
    email: {type: String, required: true, minlength: 5, maxlength: 256, unique: true},
    password: {type: String, required: true, minlength: 5, maxlength: 1024},
    isAdmin: {type: Boolean, default: false}
});

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({_id: this._id, name: this.name, email: this.email, isAdmin: this.isAdmin}, config.get("jwtPrivateKey"));
  return token;
}
const User = mongoose.model('User', userSchema, 'users');
function validateUser(user) {
    const schema = {
      name: Joi.string().min(5).max(128).required(),
      email: Joi.string().min(5).max(256).required().email(),
      password: Joi.string().min(5).max(256).required(),
      isAdmin: Joi.boolean()
    };
    return Joi.validate(user, schema);
}
module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.validate = validateUser;
module.exports.generateAuthToken = this.generateAuthToken;