import app from "./app";
import http from "http";
import {Server} from "socket.io";

const PORT = 4885;

const handleListening = () => 
    console.log(`✅ 서버연결 성공!: http://localhost:${PORT}`);

const httpServer = http.createServer(app);
const ioServer = new Server(httpServer);

ioServer.on("connection", (socket)=>{
    console.log('채팅 서버에 접속되었습니다');

});

// 이렇게 해주면 라우터에서 Socket.io를 사용할 수 있다.
app.set('ioServer', ioServer)

httpServer.listen(PORT, handleListening);