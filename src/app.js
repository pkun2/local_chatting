import express from "express";
import bodyParser from "body-parser";
import path from "path";
import homeRouter from "./router/homeRouter";
import userRouter from "./router/userRouter";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//서버 구성
app.use('/src/styles', express.static(path.join(__dirname, 'styles')));

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use("/", homeRouter);
app.use("/user", userRouter);

export default app;