const winston = require('winston');
module.exports = function(){
    winston.exceptions.handle(
        new winston.transports.File(
            {filename: 'uncaught-exceptions.log'}
        )
    );
    process.on('unhandledRejection', (ex) => {
        throw ex; 
        //by throwing this ex, winston will automatically catch this and log it
    });
    winston.add(new winston.transports.File({filename: 'loggin.log'}));
}