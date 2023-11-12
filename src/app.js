import express from "express";
import homeRouter from "./router/homeRouter";

const app = express();

app.use("/", homeRouter);

export default app;