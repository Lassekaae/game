//define canvas
var canvas = $("canvas")[0];
var context = canvas.getContext("2d");

//canvas width & height
canvas.width = 300;
canvas.height = 300;

//keys {object}
var keys = {}
keys.up;
keys.left;
keys.down;
keys.right;
keys.w;
keys.a;
keys.s;
keys.d;

//zone1 {object}
var zone1 = {};
zone1.color = "rgba(255,0,0,0.3)";
zone1.size = 50;
zone1.x = 40;
zone1.y = 40;

//zone2 {object}
var zone2 = {};
zone2.color = "rgba(0,0,255,0.3)";
zone2.size = 50;
zone2.x = 40;
zone2.y = 40;

//player1 {object}
var player1 = {}
player1.points = 0;
player1.color = "rgba(255,0,0,0.8)";
player1.size = 20;
player1.speed = 3;
player1.x = 0;
player1.y = 0;

//player2 {object}
var player2 = {}
player2.points = 0;
player2.color = "rgba(0,0,255,0.8)";
player2.size = 20;
player2.speed = 3;
player2.x = 0;
player2.y = 0;

//keydown event
$(window).on("keydown", function (e) {
    event.preventDefault();
    switch (e.keyCode) {
        case 38:
            keys.up = true;
            keys.down = false;
            break;
        case 37:
            keys.left = true;
            keys.right = false;
            break;
        case 40:
            keys.down = true;
            keys.up = false;
            break;
        case 39:
            keys.right = true;
            keys.left = false;
            break;
        case 87:
            keys.w = true;
            keys.s = false;
            break;
        case 65:
            keys.a = true;
            keys.d = false;
            break;
        case 83:
            keys.s = true;
            keys.w = false;
            break;
        case 68:
            keys.d = true;
            keys.a = false;
            break;
    }
});

//keyup event
$(window).on("keyup", function (e) {
    switch (e.keyCode) {
        case 38:
            keys.up = false;
            break;
        case 37:
            keys.left = false;
            break;
        case 40:
            keys.down = false;
            break;
        case 39:
            keys.right = false;
            break;
        case 87:
            keys.w = false;
            break;
        case 65:
            keys.a = false;
            break;
        case 83:
            keys.s = false;
            break;
        case 68:
            keys.d = false;
            break;
    }
});

//interval
setInterval(loop, 1);

//loop function
function loop() {
    movement();
    zoneCollision()
    canvasCollision();
    update();
}

//movement function
function movement() {
    draw();
    //player1
    if (keys.up == true && player1.y > 0) player1.y = player1.y - player1.speed;
    if (keys.left == true && player1.x > 0) player1.x = player1.x - player1.speed;
    if (keys.down == true && player1.y + player1.size < canvas.height) player1.y = player1.y + player1.speed;
    if (keys.right == true && player1.x + player1.size < canvas.width) player1.x = player1.x + player1.speed;
    //player2
    if (keys.w == true && player2.y > 0) player2.y = player2.y - player2.speed;
    if (keys.a == true && player2.x > 0) player2.x = player2.x - player2.speed;
    if (keys.s == true && player2.y + player2.size < canvas.height) player2.y = player2.y + player2.speed;
    if (keys.d == true && player2.x + player2.size < canvas.width) player2.x = player2.x + player2.speed;
}

//zoneCollision
function zoneCollision() {
    if (player1.x + player1.size < zone1.x + zone1.size && player1.x > zone1.x && player1.y + player1.size < zone1.y + zone1.size && player1.y > zone1.y) player1.points = player1.points + 1, inZone();
    if (player2.x + player2.size < zone2.x + zone2.size && player2.x > zone2.x && player2.y + player2.size < zone2.y + zone2.size && player2.y > zone2.y) player2.points = player2.points + 1, inZone();
}

//canvasCollision
function canvasCollision() {
    //player2
    if (player1.x < 0) player1.x = 0;
    if (player1.y < 0) player1.y = 0;
    if (player1.x + player1.size > canvas.width) player1.x = canvas.width - player1.size;
    if (player1.y + player1.size > canvas.height) player1.y = canvas.height - player1.size;
    //player2
    if (player2.x < 0) player2.x = 0;
    if (player2.y < 0) player2.y = 0;
    if (player2.x + player2.size > canvas.width) player2.x = canvas.width - player2.size;
    if (player2.y + player2.size > canvas.height) player2.y = canvas.height - player2.size;
}

//update
function update() {
    $("#a").html(player1.points);
    $("#b").html(player2.points);

    if (player1.points == 10) gameOver("player1");
    if (player2.points == 10) gameOver("player2");
}

//gameOver function
function gameOver(player) {
    nullKeys();
    alert("'" + player + "'" + " Won the game!")
    player1.points = 0;
    player2.points = 0;
    spawn();
}

//.ready
$(function () {
    spawn();
    inZone();
    draw();
});

//nullKeys
function nullKeys() {
    keys.up = false;
    keys.left = false;
    keys.down = false;
    keys.right = false;
    keys.w = false;
    keys.a = false;
    keys.s = false;
    keys.d = false;
}

//spawn function
function spawn() {
    player1.x = 60;
    player1.y = 50;
    player2.x = 50;
    player2.y = 60;
    draw();
}

//draw function
function draw() {
    //clear canvas
    canvas.width = canvas.width;
    //zone1
    context.fillStyle = zone1.color;
    context.fillRect(zone1.x, zone1.y, zone1.size, zone1.size);
    //zone2
    context.fillStyle = zone2.color;
    context.fillRect(zone2.x, zone2.y, zone2.size, zone2.size);
    //player1
    context.fillStyle = player1.color;
    context.fillRect(player1.x, player1.y, player1.size, player1.size);
    //player2
    context.fillStyle = player2.color;
    context.fillRect(player2.x, player2.y, player2.size, player2.size);
}

//inZone function
function inZone() {
    zone1.x = Math.floor(Math.random() * ((canvas.width - zone1.size) - 0 + 1) + 0);
    zone1.y = Math.floor(Math.random() * ((canvas.height - zone1.size) - 0 + 1) + 0);
    zone2.x = Math.floor(Math.random() * ((canvas.width - zone2.size) - 0 + 1) + 0);
    zone2.y = Math.floor(Math.random() * ((canvas.height - zone2.size) - 0 + 1) + 0);
}