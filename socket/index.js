const io = require("socket.io")(8900, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  
  let users = [];
  
  const addUser = (userId, socketId) => {
    if (!users.some((user) => user.userId === userId)) {
      users.push({ userId, socketId });
    }
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
  
    // When a user joins
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });
  
    // Handle message sending
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit("getMessage", { senderId, text });
      }
    });
  
    // ✅ Handle real-time message deletion
    socket.on("deleteMessage", ({ messageId, conversationId }) => {
      console.log(`Deleting message ${messageId} in conversation ${conversationId}`);
  
      // **Broadcast to all users in conversation**
      io.emit("deleteMessage", { messageId, conversationId });
    });
  
    // When a user disconnects
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
  