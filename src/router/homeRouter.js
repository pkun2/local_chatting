import express from "express";
import { home } from "../controller/homeController"

const homeRouter = express.Router();

homeRouter.get("/", home);

export default homeRouter;