import {Request, Response} from "express";

const express = require("express");

const router = express.Router();

const eventsHandler = require("../handlers/events");

router.get("/events", (req: Request, res: Response) => {
    console.log("api/events request");
    eventsHandler.getEvents(req, res);
});

router.post("/events", (req: Request, res: Response) => {
    eventsHandler.getEvents(req, res);
});
module.exports = router;
