import {Request, Response} from "express";

module.exports = {
    getUptime(req: Request, res: Response) {
        res.send(`<h1>Uptime: ${this._getValidTime(Math.floor(process.uptime()))}</h1>`);
    },

    _getValidTime(input: number) {
        let sec = input;
        const hours = Math.floor(sec / 3600);
        sec %= 3600;
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${hours}:${minutes}:${seconds}`;
    },
};
