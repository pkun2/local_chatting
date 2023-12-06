import express from "express";
import { groupchat, getChatroom, postChatroom, getAddChatroom, postAddChatroom, home, sendLocation } from "../controller/homeController"

const homeRouter = express.Router();

homeRouter.post("/send-location", sendLocation);
homeRouter.get("/", home);
homeRouter.get("/groupchat", groupchat);
homeRouter.route("/addchatroom").get(getAddChatroom).post(postAddChatroom);
homeRouter.route("/chatroom/:id").get(getChatroom).post(postChatroom);

export default homeRouter;