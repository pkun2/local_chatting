import express from "express";
import homeRouter from "./router/homeRouter";
import userRouter from "./router/userRouter";

const app = express();

//서버 구성

app.use("/", homeRouter);
app.use("/user", userRouter);

export default app;