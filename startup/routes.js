const express = require('express');
module.exports = function (app) {
    app.use(express.json());
    app.set('trust proxy', true);
    app.get('/', (req,res) =>{
        res.status(404).send('Oops you shouldn\'t be here!');
    });
    app.use('/api/genres', require('../routes/generes.js'));
    app.use('/api/titles', require('../routes/titles.js'));
    app.use('/api/customers', require('../routes/customers.js'));
    app.use('/api/movies', require('../routes/movies.js'));
    app.use('/api/rentals_v1', require('../routes/rentals_v1.js'));
    app.use('/api/rentals_v2', require('../routes/rentals_v2.js'));
    app.use('/api/users', require('../routes/users.js'));
    app.use('/api/auth', require('../routes/auth.js'));
    app.use('/api/returns', require('../routes/returns.js'));
    app.use('*', (req, res) =>{
        res.status(404).send(`Error: Requested Path ${req.originalUrl} not found`);
    });
};