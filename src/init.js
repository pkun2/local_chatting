import app from "./app";
import http from "http";
import {Server} from "socket.io";

const PORT = 4885;

const handleListening = () => 
    console.log(`✅ 서버연결 성공!: http://localhost:${PORT}`);

const httpServer = http.createServer(app);
const ioServer = new Server(httpServer);

ioServer.on("connection", (socket)=>{
    console.log(socket);
});

httpServer.listen(PORT, handleListening);