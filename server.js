const express = require("express");
const socket = require("socket.io");

//App setup
const app = express();
const server = app.listen(4000, function() {});

//Static files
app.use(express.static("public"));

//Socket setup
const io = socket(server);

io.on("connection", function(socket) {
    socket.on("chat", function(data){
        io.sockets.emit("chat", data);
    });
});