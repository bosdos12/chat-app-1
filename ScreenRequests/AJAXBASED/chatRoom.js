// Importing Schemas;
const chatRoomSchemaVar = require ("../../Schema/chatRoomSchema.js");

const fs = require("fs");

module.exports = (app) => {
    app.post("/chatRoom", (req, res) => {

        // Authenticating the entered user data;
        const username = req.body.username;
        const roomID   = req.body.roomID;

        console.log(username);
        console.log(roomID);
        
        new Promise((resolve, reject) => {
            if (username.length > 0 && username != undefined && username != null) {
                if (roomID.length > 0 && roomID != undefined && roomID != null) {

                    // Checking if a room with the entered roomID exists;
                    chatRoomSchemaVar.find({roomID: roomID}).then(dbRes => {
                        if (dbRes.length > 0) {
                            console.log(dbRes);

                            // Now cheecking if there already is a user in the given room with the username entered;
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

                        } else res.json({validity: false, msg: "No room exists with the entered room ID."}); // Room ID doesnt exist;
                    }).catch(err => {
                        console.log(err);
                        res.json({validity: false, msg: "Internal server error."});      // Internal server error accessing the database;
                    });
                } else res.json({validity: false, msg: "Please enter a valid room ID."}) // Invalid RoomID;
            } else res.json({validity: false, msg: "Please enter a valid username."});   // Invalid username;
        }).then(() => { // Success;
            // Success;
            fs.readFile('public/html/chatRoom.html', 'utf8' , (err, fileText) => {
                // Reading the html file for the chat page post successfull login,
                // If there is an error reading the file, responding with a validity of false with error message set as internal server error;
                if (err) {
                console.error(err)
                res.json({validity: false, msg: "Internal server error."});
                };

                // If file read successfull,
                // responding with a validity of true and "successfull" attribute containing the chat screens html;
                res.json({validity: true, webHtml: fileText});
            });


        }).catch(() => { // Username already exists;
            res.json({validity: false, msg: `A user with the username of "${username}" already exists in the room: "${roomID}"`});
        })



    });
};