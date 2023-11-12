import express from "express";
import homeRouter from "./router/homeRouter";

const app = express();

//서버 구성

app.use("/", homeRouter);

export default app;