const fs = require('fs');
const events = require('../files/events');
const INCORRECT_TYPE = 'Incorrect type';

module.exports = {
    getEvents: function (req, res) {
        let type = req.query.type;
        if (type) {
            if (this._isTypeValid(type)) {
                let result = [];
                events.events.forEach((event, i) => {
                    if (event.type == type) {
                        result.push(event)
                    }
                });
                res.status(200).send(result);
            } else {
                res.status(400).send(INCORRECT_TYPE);
            }
        } else {
            res.send(events);
        }

    },

    _isTypeValid: function (type) {
        const eventTypes = ['info', 'critical'];
        for (let i = 0; i < eventTypes.length; i++) {
            if (eventTypes[i] == type) {
                return true;
            }
        }

        return false;
    }
}