const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => { 
    //#swagger.tags=['Hello World']
    res.send('Hello World from Argentinaa'); 
});

router.use('/vehicles', require('./vehicles'));

module.exports = router;
