//Make connection
var socket = io.connect("http://localhost:4000");

//Emit events
$(window).on("keydown", function() {
    socket.emit("chat", {
        message: "Niklas"
    });
});

//Listen for events
socket.on("chat", function(data) {
    console.log(data.message);
});