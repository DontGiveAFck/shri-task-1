module.exports = {
    getUptime: function (req, res) {
        res.send(`<h1>Uptime: ${this._getValidTime(Math.floor(process.uptime()))}</h1>`);
    },

    _getValidTime: function (sec) {
        let hours = Math.floor(sec / 3600);
        sec %= 3600;
        let minutes = Math.floor(sec / 60);
        let seconds = sec % 60;
        return `${hours}:${minutes}:${seconds}`;
    }
}