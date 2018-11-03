import express = require("express");
import {Request, Response} from "express";

const router = express.Router();
const status = require("../handlers/status");

router.get("/status", (req: Request, res: Response) => {
    status.getUptime(req, res);
});

module.exports = router;
