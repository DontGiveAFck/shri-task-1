const express = require('express');
const router = express.Router();
const status = require('../handlers/status');

router.get('/status', (req, res) => {
    status.getUptime(req, res);
});

module.exports = router;