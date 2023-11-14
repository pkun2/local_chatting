import express from "express";
import db from "../firebase";

export const home = (req, res) => {
    const ref = db.ref();
    const usersRef = ref.child('s');

    usersRef.set({
    alanisawesome: {
        date_of_birth: 'June 23, 1912',
        full_name: 'Alan Turing'
    },
    gracehop: {
        date_of_birth: 'December 9, 1906',
        full_name: 'Grace Hopper'
    }
    });
    return res.json({firebase : true});
}

export const groupchat = (req, res) => {
    return res.send("groupchat");
};

export const chatroom = (req, res) => {
    return res.send("chatroom");
}