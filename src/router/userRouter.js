import express from "express";
import { getLogin, getRegister, postLogin, postRegister, logout } from "../controller/userController";

const userRouter = express.Router();

userRouter.route("/login").get(getLogin).post(postLogin);
userRouter.route("/register").get(getRegister).post(postRegister);
userRouter.get("/logout", logout);

export default userRouter;