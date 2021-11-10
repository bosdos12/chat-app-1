module.exports = (socket, infoToSend) => {
    socket.emit("infoMessage", infoToSend);
};