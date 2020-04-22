const auth = require('../middleware/auth.js');
const admin = require('../middleware/admin.js');
const {Movie, validate} = require('../models/movies.js');
const {Genre} = require('../models/genres.js');
const mongoose = require('mongoose');
const asyncMiddleWare = require('../middleware/async.js');
const validateObjectId = require('../middleware/validateObjectId.js');
mongoose.set('useFindAndModify', false);

const express = require('express');
const router = express.Router();

router.get('/', auth, asyncMiddleWare(async (req, res) =>{
    const movie = await Movie.find().sort({name: 1});
    (movie.length > 0) ? res.status(200).send(movie): res.status(404).json('No Records Found');
}));
router.get('/:id', [validateObjectId, auth], asyncMiddleWare(async (req, res) =>{
    const movie = await Movie.findById(req.params.id);
    (movie) ? res.status(200).send(movie): res.status(404).json('No such Record Found');
}));
router.post('/', auth, asyncMiddleWare(async (req, res)=> {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid GenreID');

    let movie = new Movie({
        title: req.body.title, 
        numberInStock: req.body.numberInStock, 
        dailyRentalRate: req.body.dailyRentalRate, 
        genre: {
            _id: genre._id,
            name: genre.name
        }});
    movie = await movie.save();
    res.status(200).send(movie);
}));
router.put('/:id', [auth, validateObjectId], asyncMiddleWare(async (req, res)=> {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid GenreId.......');
    
    const movie = await Movie.findByIdAndUpdate(req.params.id,
    { 
        title: req.body.title,
        genre: {
        _id: genre._id,
        name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
    res.send(movie);
}));
router.delete('/:id', [auth, admin, validateObjectId], asyncMiddleWare(async (req, res)=> {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    res.status(200).send(movie);
}));
module.exports = router;