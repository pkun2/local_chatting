import express from "express";
import { home, groupchat, chatroom } from "../controller/homeController"

const homeRouter = express.Router();

homeRouter.get("/", home);
homeRouter.get("/groupchat", groupchat);
homeRouter.get("/chatroom", chatroom)

export default homeRouter;