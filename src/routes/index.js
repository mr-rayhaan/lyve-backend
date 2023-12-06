const express = require('express');
const apiRoutes = require('./menuRoutes');

const router = express.Router();

router.use('/api', apiRoutes);

module.exports = router;
