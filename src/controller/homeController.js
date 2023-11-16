import express from "express";
import db from "../firebase";
import admin from "firebase-admin";

export const home = (req, res) => {
    return res.render("home");
}

export const groupchat = (req, res) => {
    //이곳에 그룹채팅 리스트들을 불러오는 코드를 작성하면 됩니다.
    return res.render("groupChat");
};

/* export const getChatroom = (req, res) => {
    //이곳에 채팅방을 불러오는 코드를 작성하면 됩니다.
    const id = req.params.id;
    const messageList = [];

    const ref = db.ref(`/chat/${id}`);
    
    const messagesRef = ref.child('messages');
    
    messagesRef.on('child_added', function(snapshot) {
        const wrappedMessage = snapshot.val();

        const message = wrappedMessage.message;
        const user = wrappedMessage.user;
        
        messageList.push(wrappedMessage);
        //console.log(message.user + ': ' + message.message);
    });

    return res.render("chatroom", { messageList });
    
} */

export const getChatroom = async (req, res) => {
    try {
        const id = req.params.id;
        const messageList = [];

        const ref = db.ref(`/chat/${id}`);
        const messagesRef = ref.child('messages');

        // once 메소드를 사용하여 한 번만 데이터를 읽어옴
        const snapshot = await messagesRef.once('value');
        
        snapshot.forEach((childSnapshot) => {
            const wrappedMessage = childSnapshot.val();
            messageList.push(wrappedMessage);
        });
        const currentUser = "Alan";

        return res.render("chatroom", { messageList, currentUser, id });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
};



export const postChatroom = (req, res) => {
    const id = req.params.id;
    const message = req.body.message;

    const ref = db.ref(`/chat/${id}`); 

    const usersRef = ref.child('messages');

    usersRef.push({
        message: message,
        user: 'Alan',
        timestamp: admin.database.ServerValue.TIMESTAMP
    });

    return res.redirect(`/chatroom/${id}`);
}
