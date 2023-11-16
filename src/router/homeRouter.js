import express from "express";
import { home, groupchat, getChatroom, postChatroom } from "../controller/homeController"

const homeRouter = express.Router();

homeRouter.get("/", home);
homeRouter.get("/groupchat", groupchat);
homeRouter.route("/chatroom/:id").get(getChatroom).post(postChatroom);

export default homeRouter;