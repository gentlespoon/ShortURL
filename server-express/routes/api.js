var express = require('express');

var router = express.Router();

var api = require('../modules/apiFormat');

var userRouter = require('./api/user');
var urlRouter = require('./api/url');

router.all('/', (req, res, next) => { res.send(api(0, '?')); });
router.use('/user', userRouter);
router.use('/url', urlRouter);

module.exports = router;
