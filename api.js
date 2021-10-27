const express = require('express');
const router = express.Router();


router.use('/contacts', require('./routes/contacts'))

module.exports = router;