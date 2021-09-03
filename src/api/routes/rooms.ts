const { json } = require("express");
const roomController = require(`../controllers/rooms`);
import { Router } from "express";

const router = Router();

//All API routes for Room Entity

//Create/ Join a Room
router.get(`/:name`, roomController.getSession);

module.exports = router;