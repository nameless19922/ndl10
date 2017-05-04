const express = require('express');
const router  = express.Router();

router.use('/contacts', require('./contacts'));
router.use('/api', require('./api'));

module.exports = router