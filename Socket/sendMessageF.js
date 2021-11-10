const chatRoomSchemaVar = require("../Schema/chatRoomSchema.js");

const serverIO = require("../server.js");


module.exports = (socket) => {
    // The function for sending messages by the current connected user;
    socket.on("messageSent", (sendMessageData) => {
        const username = sendMessageData.user;
        const message  = sendMessageData.msg;
        const roomID   = sendMessageData.roomID;

        console.log(sendMessageData);
        console.log(serverIO);

        // Authenticating the received data basically;
        if (username != undefined && username != null && username.length > 0) {
            if (message != undefined && message != null && message.length > 0) {
                
                // (could be more secure here and yes im leaving an open corner for attacks but I have too much school work and i just rly wanna finish the site,
                // BUT THE MAIN POINT IS ITS SOMETHING I CAN FIX I JUST CANT PHYSICALLY DUE TO TIME!);
                // Sending the message to everyone in the room;
                chatRoomSchemaVar.find({roomID: roomID}).then(dbRes => {
                    for (otherUsers of dbRes[0].currentMembers) {
                        if (otherUsers.username != username) {
                            serverIO.to(otherUsers.socketID).emit("receiveMessageFromOthers", {username, message}); 
                            // THIS SENDS TO EVERYONE EXCEPT OF YOURSELF SO SENDING TO YOURSELF IN A NORMAL EMIT;
                            // (NOT RELATED TO THE IF STATEMENT, THE IF STATEMENT IS BUILT BECAUSE OF THAT REASON IN FACT SO I CAN SEND TO NORMAL USER IN A "your texts" way)
                        } else {
                            console.log(message);
                            socket.emit("receiveMessageFromYourself", message); // To yourself/current connected socket;
                        };
                    };
                })

                
            } require("./sendInfoToCurrentUserF")(socket, {errCause: "msg"});
        } require("./sendInfoToCurrentUserF")(socket, {errCause: "usn"});

    });
};