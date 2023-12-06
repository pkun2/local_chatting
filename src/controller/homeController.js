import axios from "axios";
import { rtDB } from "../firebase";
import admin from "firebase-admin";

export const home = (req, res) => {
    const isLogin = req.session.user;
    const city = req.session.city || '현재 위치를 불러올 수 없음';

    console.log('city:', city);
    return res.render("home", { isLogin, city });
}
export const sendLocation = async(req, res) => {
    const { latitude, longitude } = req.body;
    const location = await reverseGeocode(latitude, longitude);

    const city = extractCityFromAddress(location)
    
    req.session.city = city;
    return res.redirect('/');
};

const extractCityFromAddress = (location) => {
    const parts = location.split(',').map(part => part.trim());
    // 한국 주소에서 도시 이름을 찾는 로직
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
        
        const ref = rtDB.ref(`/${user.uid}`);
        const snapshot = await ref.once('value');
        
        snapshot.forEach((childSnapshot) => {
            const chat = childSnapshot.val();

            // chat이 null이거나 undefined인 경우를 처리
            if (!chat || typeof chat.name === 'undefined') {
                return; // 이 경우 해당 반복을 건너뛰고 다음 childSnapshot으로 넘어갑니다.
            }
            chatNameList.push(chat.name);
            
            const messages = chat.messages ? Object.values(chat.messages) : [];
            messagesList.push(messages);
        });
        idList.push(Object.keys(snapshot.val()));
        const refinedIdList = idList[0];
        console.log(refinedIdList);

        return res.render("groupChat", { chatNameList, refinedIdList, messagesList });
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
        const currentUser = user.email;

        // chatName을 가져오기 전에 snapshot의 부모 노드를 참조
        const chatRoomSnapshot = await ref.once('value');
        const chatName = chatRoomSnapshot.val() ? chatRoomSnapshot.val().name : 'Unknown';

        return res.render("chatroom", { messageList, currentUser, chatName, id });
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

     // 전역변수로 등록해논 io객체를 가져온다
    const ioServer = req.app.get('ioServer');
    // post요청하는 url에 포함된 param인 id를 기준으로 socket.io내부에서 라우팅하여 관련된 id에 join해 있는 소켓들에게만 'chat' 이벤트를 보내준다
    ioServer.to(id).emit('postchat', user.email, message);

    return res.redirect(`/chatroom/${id}`);
}

export const getAddChatroom = (req, res) => {
    return res.render("addChatroom");
}

export const postAddChatroom = async (req, res) => {
    console.log(req.body);
    const user = req.session.user;
    const chatName = req.body.name;
    const ref = rtDB.ref(`/${user.uid}`);
    const usersRef = ref.push({
        name: chatName
    });
    const chatId = usersRef.key;

    return res.redirect(`/chatroom/${chatId}`);
}


