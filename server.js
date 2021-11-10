// Basic initialisation imports;
const express  = require("express");
const app      = express();
const PORT     = process.env.PORT || 80;
const mongoose = require("mongoose");

// Allowing json data to be parsed;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Constant variables;
const DBURI = "mongodb+srv://AdakCelina:112211@chatappcluster.3aqzo.mongodb.net/chatappDatabase?retryWrites=true&w=majority";

// Setting up the server;
const server = require("http").createServer(app);

// Setting up the socket.io;
const io = require("socket.io")(server, {cors: {origin: "*"}});
module.exports = io;

// Setting up the ejs;
app.set("view engine", "ejs");

// Setting the Public folder;
app.use(express.static('public'));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;
// Page Requests;
require("./ScreenRequests/mainPage.js")(app);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;
// AJAX Requests:
// Get:

// Post:
require("./ScreenRequests/AJAXBASED/chatRoom.js")(app);




// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;
// SOCKET;
// Event emiter for listening on the io;
io.on('connection', (socket) => {
    console.log(`User Connected: [${socket.id}]`);


    // Socket functions;
    require("./Socket/sendMessageF.js")(socket);         // Send message;
    require("./Socket/connectUserToChatRoom.js")(socket) // Connect user to a chat room;




});








// Starting the server;
mongoose.connect(DBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    // Successfull
    server.listen(PORT, () => console.log("Server running..."));
}).catch(err => {
    console.log(err);
});