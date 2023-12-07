import axios from "axios";
import { rtDB } from "../firebase";
import admin from "firebase-admin";

export const home = async(req, res) => {
    const isLogin = req.session.user;
    const city = req.session.city;

    const chatList = await getChatroomNamesByCity(city);

    return res.render("home", { isLogin, city, chatList });
}

const getChatroomNamesByCity = async (cityName) => {
    const rootRef = rtDB.ref();
    const snapshot = await rootRef.once('value');
  
    const chatrooms = [];

    snapshot.forEach(userSnapshot => {
        userSnapshot.forEach(chatroomSnapshot => {
            const chatroom = chatroomSnapshot.val();
            if (chatroom && chatroom.name && chatroom.city === cityName) {
                chatrooms.push({
                    name: chatroom.name,
                    key: chatroomSnapshot.key
                });
            }
        });
    });
    return chatrooms;
};


export const sendLocation = async(req, res) => {
    const { latitude, longitude } = req.body;
    const location = await reverseGeocode(latitude, longitude);

    const city = extractCityFromAddress(location)
    
    req.session.city = city;
    return res.redirect('/');
};

const extractCityFromAddress = (location) => { // 한국 주소에서 도시 이름을 찾는 함수
    const parts = location.split(',').map(part => part.trim());
    
    const cityPart = parts.find(part => part.endsWith('si') || part.endsWith('gun'));
  
    return cityPart || '잘못된 형식의 도시 이름입니다.';
  }


const reverseGeocode = async(latitude, longitude) => {
    try {
      const apiKey = 'AIzaSyBc7At1HULMD_kc7Kl3N04LIfYw4i2oxlk'; // Google API 키
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
      
      const response = await axios.get(url);
      console.log(response.data.status)
      if (response.data.status === 'OK') {
        return response.data.results[0].formatted_address;
      } else {
        return '해당 위치를 찾지 못했습니다.';
      }
    } catch (error) {
      console.error('Error during reverse geocoding', error);
      return 'Error';
    }
  }

  export const groupchat = async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            return res.redirect('/user/login');
        }

        const chatNameList = [];
        const messagesList = [];
        const idList = [];
        
        // '/chatrooms' 경로에서 모든 채팅방을 순회
        const chatroomsRef = rtDB.ref('/chatrooms');
        const chatroomsSnapshot = await chatroomsRef.once('value');
        
        chatroomsSnapshot.forEach(chatroomSnapshot => {
            const chatroom = chatroomSnapshot.val();
            // createdBy 필드가 현재 사용자의 이메일과 일치하는 경우
            if (chatroom && chatroom.createdBy === user.email) {
                chatNameList.push(chatroom.name);
                const messages = chatroom.messages ? Object.values(chatroom.messages) : [];
                messagesList.push(messages);
                idList.push(chatroomSnapshot.key);
            }
        });

        return res.render("groupChat", { chatNameList, idList, messagesList });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
};

export const getChatroom = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/user/login');
        }

        const chatroomId = req.params.id; // URL로부터 채팅방 ID 가져오기
        const messageList = [];

        // '/chatrooms/{chatroomId}' 경로를 사용하여 채팅방 정보 조회
        const chatRoomRef = rtDB.ref(`/chatrooms/${chatroomId}`);
        const chatRoomSnapshot = await chatRoomRef.once('value');
        const chatRoomData = chatRoomSnapshot.val();

        if (!chatRoomData) {
            return res.status(404).send('Chatroom not found');
        }

        // 메시지 데이터 추출
        if (chatRoomData.messages) {
            Object.values(chatRoomData.messages).forEach(message => {
                messageList.push(message);
            });
        }

        const chatName = chatRoomData.name || 'Unknown';
        const currentUser = req.session.user.email;

        return res.render("chatroom", { messageList, currentUser, chatName, id: chatroomId });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
};

export const postChatroom = async (req, res) => {
    const chatroomName = req.body.chatName;
    const user = req.session.user;
    const message = req.body.message;

    try {
        const chatroomsRef = rtDB.ref('/chatrooms');
        const chatroomsSnapshot = await chatroomsRef.once('value');
        let chatroomId = null;

        // 모든 채팅방을 순회하며 해당 채팅방 이름을 찾기
        chatroomsSnapshot.forEach(chatroomSnapshot => {
            const chatroom = chatroomSnapshot.val();
            if (chatroom.name === chatroomName) {
                chatroomId = chatroomSnapshot.key;
                return true; // 순회 중지
            }
        });

        if (!chatroomId) {
            return res.status(404).send('Chatroom not found');
        }

        // 메시지 게시
        const messagesRef = rtDB.ref(`/chatrooms/${chatroomId}/messages`);
        messagesRef.push({
            message: message,
            user: user.email,
            timestamp: admin.database.ServerValue.TIMESTAMP
        });

        // socket.io를 사용하여 채팅 이벤트 전송
        const ioServer = req.app.get('ioServer');
        ioServer.to(chatroomId).emit('postchat', user.email, message);

        return res.redirect(`/chatroom/${chatroomId}`);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
};

export const getAddChatroom = (req, res) => {
    return res.render("addChatroom");
}

export const postAddChatroom = async (req, res) => {
    const user = req.session.user;
    const chatName = req.body.name;
    const city = req.session.city || 'Unknown'; // 세션에 도시 정보가 없는 경우를 대비

    // '/chatrooms' 경로에 새 채팅방 추가
    const chatroomsRef = rtDB.ref('/chatrooms');
    const newChatroomRef = chatroomsRef.push({
        name: chatName,
        messages: null,
        city: city,
        createdBy: user.email // 채팅방을 생성한 사용자 정보 추가
    });
    const chatId = newChatroomRef.key;

    return res.redirect(`/chatroom/${chatId}`);
};



