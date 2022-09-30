const io = require("socket.io")(8901, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const db = require("./src/connection");

let users = [];

const addUser = async (userId, socketId) => {
  try {
    const duplicateUser = await db.chatUsers.findOne({
      where: { userId },
    });
    if (!duplicateUser) {
      await db.chatUsers.create({ userId, socketId });
    }
  } catch (err) {
    console.log(err);
  }
};

const removeUser = async (socketId) => {
  await db.chatUsers.destroy({ socketId });
};

const getUser = async (userId) => {
  const result = await db.chatUsers.findOne({
    where: { userId },
  });
  return result;
};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUser", userId);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    socket.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  socket.on("discount", () => {
    console.log("A user disconnected");
    removeUser(socket.id);
    io.emit("getUser", users);
  });
});
