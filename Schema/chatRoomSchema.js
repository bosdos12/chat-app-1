// Importing Modules;
const mongoose = require("mongoose");

// Importing the Schema creation function;
const Schema = mongoose.Schema;

const chatRoomSchema = new Schema({
    roomID: {
        type: String,
        required: true
    },
    currentMembers: {
        type: Array,
        required: true,
        default: []
    },
    adminOfRoom: {
        type: String,
        required: true
    }
});


// modeling the schema and then exporting it
const chatRoomSchemaVar = mongoose.model("chatroom", chatRoomSchema);
module.exports = chatRoomSchemaVar;







