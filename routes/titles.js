const auth = require('../middleware/auth.js');
const admin = require('../middleware/admin.js');
const titli = require('../models/titles.js');
const mongoose = require('mongoose');
const asyncMiddleWare = require('../middleware/async.js');
const validateObjectId = require('../middleware/validateObjectId.js');
const express = require('express');
const router = express.Router();

router.get('/', auth, asyncMiddleWare(async (req, res) =>{
    const titles = await titli.Title.find().sort({name: 1});
    (titles.length > 0) ? res.status(200).send(titles): res.status(404).json('No Records Found');
}));
router.get('/:id', [validateObjectId, auth], asyncMiddleWare(async (req, res) =>{
    const title = await titli.Title.findById(req.params.id);
    (title) ? res.status(200).send(title): res.status(404).json('No such Record Found');
}));
router.post('/', auth, asyncMiddleWare(async (req, res)=> {
    const { error } = titli.validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    let title = new titli.Title({name: req.body.name});
    title = await title.save();
    res.status(200).send(title);
}));
router.put('/:id', [validateObjectId, auth], asyncMiddleWare(async (req, res)=> {
    const { error } = titli.validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    const result = await titli.Title.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
    res.status(200).send(result);
}));
router.delete('/:id', [auth, admin, validateObjectId], asyncMiddleWare(async (req, res)=> {
    const title = await titli.Title.findByIdAndDelete(req.params.id)
    res.status(200).send(title);
}));
module.exports = router;