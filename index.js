require('dotenv').config()
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
// const io = socket(server);

const cors = require("cors");
const path = require('path');

const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const rooms = {};

io.on("connection", socket => {
  console.log('backend up', socket.id)
  socket.on("join room", roomID => {
    if (rooms[roomID]) {
      rooms[roomID].push(socket.id);
      console.log('room already exists')
    } else {
      rooms[roomID] = [socket.id];
    }
    const otherUser = rooms[roomID].find(id => id !== socket.id);
    if (otherUser) {
      socket.emit("other user", otherUser);
      socket.to(otherUser).emit("user joined", socket.id);
      console.log('user joined', rooms[roomID][0])
    }
  });

  socket.on("offer", payload => {
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", payload => {
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", incoming => {
    io.to(incoming.target).emit("ice-candidate", incoming.candidate);
  });

});

if (process.env.PROD) {
  app.use(express.static(path.join(__dirname, './client/build')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
  })
}


const port = process.env.PORT || 8000

server.listen(port, () => console.log(`server is running on port ${port}`));