let io;
exports.init = (httpServer) => {
  io = require("socket.io")(httpServer);
  io.on("connect",(socket)=>{
    socket.on("joinUserGroup",(data)=>{
      socket.join(data)
      socket.emit("joined")

    })
    socket.on("join",(data)=>{
      socket.join(data)
    //  socket.emit("joinedUserRoom")
    })
  })
};
exports.getIO = () => {
  if (!io) {
    throw new Error("socket not init");
  }
  return io;
};
