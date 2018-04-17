const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const records = require('./records.js');
const port = process.env.PORT || 3000;

// 加入線上人數計數
let onlineCount = 0;

app.get('/', (req, res) => {
    res.sendFile( __dirname + '/views/index.html');
});

io.on('connection', (socket) => {
    // 有連線發生時增加人數
    onlineCount++;
    // 發送人數給網頁
    io.emit("online", onlineCount);
    // 發送紀錄
    socket.emit("maxRecord", records.getMax());

    records.get((msgs) => {
        socket.emit("chatRecord", msgs);
    });

    socket.on("greet", () => {
        socket.emit("greet", onlineCount);
    });

    socket.on("send", (msg) => {
        // 如果 msg 內容鍵值小於 2 等於是訊息傳送不完全
        // 因此我們直接 return ，終止函式執行。
        if (Object.keys(msg).length < 2) return;
        records.push(msg);
    });

    socket.on('disconnect', () => {
        // 有人離線了，扣人
        onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        io.emit("online", onlineCount);
    });
});

records.on("new_message", (msg) => {
    // 廣播訊息到聊天室
    io.emit("msg", msg);
});

server.listen(port, () => {
    console.log("Server Started. http://localhost:" + port);
});