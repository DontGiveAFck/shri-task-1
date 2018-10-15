const fs = require('fs');

const error = {
    incorrectType: 'incorrect type',
};
const eventTypes = ['info', 'critical'];

module.exports = {
    getEvents(req, res) {
        // for pagination
        const limit = req.query.limit || req.body.limit || Number.MAX_SAFE_INTEGER;
        const offset = req.query.offset || req.body.offset || 0;

        // if type specified
        const type = req.query.type || req.body.type;
        if (type) {
            const types = req.query.type.split(':');
            if (this._isTypesValid(types)) {
                const result = [];
                fs.readFile(__dirname.concat('/../files/events.json'), 'utf8', (err, data) => {
                    if (err) console.log('Smth wrong with file');
                    const dataObj = JSON.parse(data);
                    dataObj.events.forEach((event) => {
                        if (types.includes(event.type)) {
                            result.push(event);
                        }
                    });
                    res.status(200).json(this._pagination(result, limit, offset));
                });
            // if error in type
            } else {
                res.status(400).json(error.incorrectType);
            }
        // if type not specified - return all
        } else {
            fs.readFile(__dirname.concat('/../files/events.json'), 'utf8', (err, data) => {
                if (err) throw err;
                const dataObj = JSON.parse(data);
                res.status(200).json(this._pagination(dataObj.events, limit, offset));
            });
        }
    },

    _isTypesValid(types) {
        let result = true;
        types.forEach((type) => {
            if (!(eventTypes.includes(type))) {
                result = false;
            }
        });
        return result;
    },

    _pagination(allEventsArray, limit, offset) {
        const res = [];
        let count = 0;
        allEventsArray.forEach((event, i) => {
            if (i + 1 > offset && count < limit) {
                res.push(event);
                count += count;
            }
        });

        return res;
    },

};
