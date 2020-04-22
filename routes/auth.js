const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, userSchema} = require('../models/users.js');
const mongoose = require('mongoose');
const asyncMiddleWare = require('../middleware/async.js');

const express = require('express');
const router = express.Router();

router.post('/', asyncMiddleWare(async (req, res)=> {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).json('Invalid Email/Password. 1');

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) return res.status(400).json('Invalid Email/Password. 2');

    const token = user.generateAuthToken();
    console.log('TOKEN= ', token);
    res.header('user', _.pick(user,['_id', 'name','email']));
    res.header('x-auth-token', token).status(200).send(_.pick(user,['_id', 'name','email']));
    res.status(200).send(token);
}));

function validate(req) {
    const schema = {
      email: Joi.string().min(5).max(256).required().email(),
      password: Joi.string().min(5).max(256).required()
    };
    return Joi.validate(req, schema);
}

module.exports = router;
