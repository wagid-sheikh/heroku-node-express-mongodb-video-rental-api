const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const winston = require('winston');
const config = require('config');

module.exports = function(){
    try{
        const db = config.get('db');
        mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true, useCreateIndex: true})
        .then(()=>winston.info(`Connected to MongoDB ${db}...`));
    }
    catch (ex){
        winston.log('error', ex);
        console.log('error occured conecting to mongodb,', ex);
    }
}