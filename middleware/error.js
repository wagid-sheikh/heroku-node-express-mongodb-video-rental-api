const winston = require('winston');
//The errors that will be logged here would be errors
//which occurs during route handling and all the code 
//inside route handler(express js codes) and not the other 
//uncaught exceptions
module.exports = function (err, req, res, next){
    winston.log('error', err.message, err);
    console.log(err);
    res.status(500).send('Something Failed');
    // error
    // warn
    // info
    // verbose
    // debug
    // silly
}