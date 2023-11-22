import express from "express";
import { rtDB } from "../firebase";
import admin from "firebase-admin";

export const home = (req, res) => {
    return res.render("home");
}

export const groupchat = async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.redirect('/user/login');
        }
        // 파이어베이스에서 해당 사용자의 채팅 리스트를 가져오는 코드
        const chatNameList = [];
        const idList = [];
        let i = 1;
        const ref = rtDB.ref(`/${user.uid}`)
        const snapshot = await ref.once('value');
        
        snapshot.forEach((childSnapshot) => {
           const chat = childSnapshot.val();
            
            chatNameList.push(chat.name);
            idList.push(String(i))
        });
        return res.render("groupChat", { chatNameList, idList });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
};

export const getChatroom = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.session.user;
        const messageList = [];

        const ref = rtDB.ref(`/${user.uid}/${id}`);
        const messagesRef = ref.child('messages');

        // once 메소드를 사용하여 한 번만 데이터를 읽어옴
        const snapshot = await messagesRef.once('value');
        
        snapshot.forEach((childSnapshot) => {
            const wrappedMessage = childSnapshot.val();
            messageList.push(wrappedMessage);
        });
        const currentUser = user.email

        return res.render("chatroom", { messageList, currentUser, id });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
};



export const postChatroom = (req, res) => {
    const id = req.params.id;
    const user = req.session.user;
    const message = req.body.message;

    const ref = rtDB.ref(`/${user.uid}/${id}`); 

    const usersRef = ref.child('messages');

    usersRef.push({
        message: message,
        user: user.email,
        timestamp: admin.database.ServerValue.TIMESTAMP
    });

    return res.redirect(`/chatroom/${id}`);
}
