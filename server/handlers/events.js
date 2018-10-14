const fs = require('fs');
const error = {
    incorrectType: 'incorrect type'
}
const eventTypes = ['info', 'critical'];

module.exports = {
    getEvents: function (req, res) {
        // for pagination
        let limit = req.query.limit || Number.MAX_SAFE_INTEGER;
        let offset = req.query.offset || 0;

        //if type specified
        let type = req.query.type || req.body.type;
        console.log('type, ', type)
        if (req.query.type) {
            let types = req.query.type.split(':');
            if (this._isTypesValid(types)) {
                let result = [];
                fs.readFile(__dirname.concat('/../files/events.json'), 'utf8', (err, data) => {
                    if (err) console.log('Smth wrong with file');
                    let dataObj = JSON.parse(data);
                    dataObj.events.forEach((event) => {
                        if(types.includes(event.type)) {
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
                let dataObj = JSON.parse(data);
                res.status(200).json(this._pagination(dataObj.events, limit, offset));
            });
        }
    },

    _isTypesValid: function (types) {
        let result = true;
        types.forEach((type) => {
            if(!(eventTypes.includes(type))) {
                result = false;
                return;
            }
        })
        return result;
    },

    _pagination: function (allEventsArray, limit, offset) {
        let res = [];
        let count = 0;
        allEventsArray.forEach((event, i) => {
            if (i + 1 > offset && count < limit) {
                res.push(event)
                count++;
            }
        });

        return res;
    }

}