import express from "express";
import bodyParser from "body-parser";
import path from "path";
import session from "express-session";
import homeRouter from "./router/homeRouter";
import userRouter from "./router/userRouter";

const app = express();

let maxAge = 5 * 60 * 1000;

app.use(session({
    secret: "asjdha@#as734SDg",
    resave: false,
    saveUninitialized: true,
    store: new session.MemoryStore({ checkPeriod: maxAge }),
    cookie: { maxAge: maxAge },
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//서버 구성
app.use('/src/styles', express.static(path.join(__dirname, 'styles')));

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use("/", homeRouter);
app.use("/user", userRouter);

export default app;