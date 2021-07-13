require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");

const mongoose = require("mongoose");
const uri =
  "mongodb+srv://link:1234567890q@link.aty5w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const connection = mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "LinkDB",
    authSource: "admin",
  })
  .then(() => {
    console.log("Mongoose connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

mongoose.connection.on("connected", () => {
  console.log("Mongodb bridge connected");
});

mongoose.connection.on("error", (err) => {
  console.log(`Mongoose connection ERROR: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection disconnected");
});

// import { Schema, model } from 'mongoose';

const roomsSchema = new mongoose.Schema({
  roomId: { type: String, default: null },
  users: { type: Array, default: [] },
});
const roomsModel = mongoose.model("rooms", roomsSchema);

const cors = require("cors");
const path = require("path");

const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const rooms = {};

io.on("connection", (socket) => {
  console.log("backend up", socket.id);
  socket.on("join room", async (roomID) => {
    const room = await roomsModel.findOne({ roomId: roomID });
    console.log(room);

    if (room) {
      room.users.push(socket.id);
      console.log("room already exists");
      room.save();
    } else {
      // room.roomID = roomID
      // room.users.push(socket.id)
      const newRoom = await new roomsModel({
        roomId: roomID,
        users: [socket.id],
      });
      newRoom.save();
    }

    const otherUser = room.users.find((id) => id !== socket.id);
    if (otherUser) {
      socket.emit("other user", otherUser);
      socket.to(otherUser).emit("user joined", socket.id);
      // console.log('user joined', rooms[roomID][0])
    }
  });

  socket.on("offer", (payload) => {
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", (payload) => {
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", (incoming) => {
    io.to(incoming.target).emit("ice-candidate", incoming.candidate);
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
}

const port = process.env.PORT || 7000;

server.listen(port, () => console.log(`server is running on port ${port}`));

// export default model('rooms', roomsSchema);
