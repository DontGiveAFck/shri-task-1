const express = require('express');
const router = express.Router();

const eventsHandler = require('../handlers/events');

router.get('/events', (req, res) => {
    console.log('api/events request');
    eventsHandler.getEvents(req, res);
});

router.post('/events', (req, res) => {
    eventsHandler.getEvents(req, res);
});
module.exports = router;