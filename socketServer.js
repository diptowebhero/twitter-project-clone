const http = require("http");
const { default: mongoose } = require("mongoose");
const { Server } = require("socket.io");
const User = require("./models/User");
const { instrument } = require("@socket.io/admin-ui");
const { deleteCache, updateCached } = require("./utilities/cacheManager");
const httpSocketServer = http.createServer();
const io = new Server(httpSocketServer, {
  cors: {
    origin: [
      "http://localhost:5000",
      "http://127.0.0.1:5000",
      "https://admin.socket.io",
    ],
    credentials: true,
  },

  methods: ["GET", "POST", "PUT", "DELETE"],
});

instrument(io, {
  auth: false,
});

io.on("connection", (socket) => {
  //connect new user
  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.emit("connected");
    console.log(user.username + " is connected");

    socket.on("disconnect", () => {
      setTimeout(async () => {
        const isActive = [...(await io.sockets.adapter.rooms.keys())].includes(
          user._id
        );

        if (!isActive) {
          User.findByIdAndUpdate(
            user._id,
            {
              $set: { activeStatus: false, lastSeen: new Date() },
            },
            { new: true }
          ).then((result) => {
            if (result) {
              updateCached(`users:${result._id}`, result);
              // console.log(result);
              console.log("user is disconnected");
            }
          });
        } else {
          // console.log("user is back");
        }
      }, 10000);
    });
  });
});

let roomsId = [];

setInterval(async () => {
  roomsId = [...(await io.sockets.adapter.rooms.keys())];

  roomsId.forEach((id) => {
    if (mongoose.isValidObjectId(id)) {
      User.findByIdAndUpdate(
        id,
        {
          $set: { activeStatus: true },
        },
        { new: true }
      ).then((result) => {
        if (result) {
          deleteCache(`users:${result._id}`);
        }
      });
      return true;
    } else {
      return false;
    }
  });
}, 10000);

module.exports = httpSocketServer;
