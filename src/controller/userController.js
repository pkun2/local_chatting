import db from "../firebase";
import admin from "firebase-admin";

export const getLogin = (req, res) => {
    return res.render("login");
}
export const postLogin = (req, res) => {
    //post method 처리
}
export const getRegister = (req, res) => {
    return res.render("register");
}
export const postRegister = (req, res) => {
    //post method 처리
}