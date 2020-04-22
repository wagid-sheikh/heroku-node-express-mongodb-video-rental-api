module.exports = function asyncMiddleWare(handler){
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch(ex){
            next(ex);
        }
    }
}

//this middleware can be used as follows
/*
router.get('/', auth, asyncMiddleWare(async (req, res) =>{
    const customer = await Customer.find().sort({name: 1});
    (customer.length > 0) ? res.status(200).send(customer): res.status(404).json('No Records Found');
}));
*/