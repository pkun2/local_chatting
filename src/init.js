import app from "./app";

const PORT = 4885;

const handleListening = () => 
    console.log(`✅ 서버연결 성공!: http://localhost:${PORT}`);

app.listen(PORT, handleListening);