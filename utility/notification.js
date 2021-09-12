const IO = require("../socket");
exports.sendIONotification = (event, data) => {
  const io = IO.getIO();
  io.to("ADMIN").emit(event, data);
};
exports.sendNotificationToChatWall = (event,data)=>{
  const io = IO.getIO()
  io.to(`ADMIN_${data.sender}`).emit(event,data)
}
