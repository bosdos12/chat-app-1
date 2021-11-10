const chatRoom = require("../Schema/chatRoomSchema");


module.exports = (socket) => {
    socket.on("connectUserToChatRoom", (data) => {
        console.log(data);
        // Data basic auth;
        const username = data.username;
        const roomID   = data.roomID;


        // console.log(socket.id);

        new Promise((resolve, reject) => {

        
        if (username != undefined && username != null && username.length > 0) {
            if (roomID != undefined && roomID != null && roomID.length > 0) {
                // Database auth;
                
                // Checking if the entered username already exists in the desired room;
                chatRoom.find({roomID: roomID}).then(dbRes => {
                    // Checking if a room with the entered roomID already exists;
                    if (dbRes.length > 0) {
                        // Checking if the user exists in the database;
                        let canResolve = true;
                        for (databaseUser of dbRes[0].currentMembers) {
                            if (databaseUser.username == username) {
                                reject();
                                canResolve = false;
                            }   
                        };
                        
                        if (canResolve) {
                            resolve();
                        };
                            
                    } else { // No room with the entered room ID;
                        socket.emit("connectUserToChatRoom", {validity: false, cause: "rde"});  // Room doesnt exist;
                    };
                }).catch(dbErr => {
                    console.log(dbErr);
                    socket.emit("connectUserToChatRoom", {validity: false, cause: "ise"});  // Internal Server Error;
                });
            } socket.emit("connectUserToChatRoom", {validity: false, cause: "roomID"});  // Invalid roomID;
        } socket.emit("connectUserToChatRoom", {validity: false, cause: "usn"});         // Invalid Username;
    }).then(async () => {
        // Sucess;
        // Putting the user and users socket ID to the desired chat room's database;
        const roomDocument = await chatRoom.findOne({roomID: roomID});

        roomDocument.currentMembers.push({username: username, socketID: socket.id});
        roomDocument.save();

        // Sending the user the needed room data;
        let usersArrayToSend = []; // Removing the socketID of users before sending it to the client;
        for (singleUser of roomDocument.currentMembers) {
            usersArrayToSend.push(singleUser.username);
        };

        socket.emit("roomUpdatesInformation", {roomAdmin: roomDocument.adminOfRoom, currentMembers: usersArrayToSend});  // Success, emiting required room data back;
        // FINISH HERE!
        
        
    }).catch(() => { // This is only called if the username in the room already exists;
        socket.emit("connectUserToChatRoom", {validity: false, cause: "usnaexist"});  // Username already exists;
    });
    });
};