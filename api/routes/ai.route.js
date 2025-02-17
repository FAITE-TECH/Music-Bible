import express from "express";
import {GetResponse} from "../controllers/ai.controller.js";


const router = express.Router();

router.post("/ask",GetResponse);


export default router;