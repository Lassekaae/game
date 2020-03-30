document.title = "Version: " + 0.1;

//define canvas
var canvas = $("canvas")[0];
var context = canvas.getContext("2d");

//canvas width & height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//On window-resize
$(window).resize(function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

//Deltatime
var deltaTime = 0;

document.addEventListener('contextmenu', event => event.preventDefault());

//Player (me) object
var me = {
    size: 90,
    speed: 550,
    color: "Yellow",
    deg: 0,
    maxHp: 10,
    percentHp: 1,
    ammo: 120,
    bleeding: false,
    special: true
};
me.hp = me.maxHp;
me.x = (canvas.width / 2) - (me.size / 2);
me.y = (canvas.height / 2) - (me.size / 2);

//Array of enemies
var enemies = [
];
var enemyInfo = {
    size: 60,
    color: "red",
    speed: 10,
    spawnrate: 10
};
//Spawn enemy
function spawnEnemy() {
    let ranHp = Math.floor(Math.random() * 5) + 1;
    let random = Math.random();
    let ranX = Math.floor(Math.random() * canvas.width);
    let ranY = Math.floor(Math.random() * canvas.height);
    if (random <= 0.5) {
        if (ranX > (canvas.width / 2)) ranX = canvas.width;
        if (ranX < (canvas.width / 2)) ranX = 0 - 50;
    }
    else {
        if (ranY > (canvas.height / 2)) ranY = canvas.height;
        if (ranY < (canvas.height / 2)) ranY = 0 - 50;
    }

    let unit = { x: ranX, y: ranY, speed: enemyInfo.speed, size: enemyInfo.size, deg: 0, hp: ranHp }
    enemies.push(unit);
}

//Counter since game started
var time = 0;
setInterval(function () {
    time = time + 1;

    //Weapon Upgrades
    if (time == 60) {
        me.color = "blue";
        projectile.speed = projectile.speed + 5;
        projectile.velocity = projectile.velocity + 100;
        projectile.dmg = projectile.dmg + 1;
        clearInterval(shooting);
    }
    if (time == 100) {
        me.color = "pink";
        projectile.velocity = projectile.velocity + 50;
        projectile.dmg = projectile.dmg + 2;
        me.ammo = me.ammo + 200;
        clearInterval(shooting);
    }

    //Check for minimized game
    if (document.hidden) {
        location.reload();
    }
}, 1000);

//Spawn enemy
spawnFunction();
function spawnFunction() {
    var spawner = setInterval(function () {
        spawnEnemy();
        clearInterval(spawner);
        spawnFunction();
    }, calcSpawnTime());
};

//Calculate spawntime
function calcSpawnTime() {
    let val;
    val = 1000 - (time * enemyInfo.spawnrate);
    if (val <= 110) val = 110; //Optimal at 150
    return val;
}

//keys {object}
var keys = {
    w: false,
    a: false,
    s: false,
    d: false
}
//keydown event
$(window).on("keydown", function (e) {
    event.preventDefault();
    switch (e.keyCode) {
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
        case 82:
            location.reload();
            break;
        case 32:
            if (me.special == true) {
                enemies = [];
                me.special = false;
            }
            break;
    }
});
//keyup event
$(window).on("keyup", function (e) {
    switch (e.keyCode) {
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

//Mouse-events
var mouse = {
    x: 0,
    y: 0
}
//Mousemove
$(canvas).on("mousemove", function (e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
});
//Mousedown
var shooting;
$(canvas).on("mousedown", function (e) {
    if (e.which == 1) {
        shoot();
        shooting = setInterval(shoot, 2000 - projectile.velocity);
    }
});

//mouseup & mouseleave
$(canvas).on("mouseup mouseleave", function () {
    clearInterval(shooting);
});

//Shoot
var bullets = [];
var projectile = {
    size: 5,
    color: "black",
    speed: 5,
    sound: "content/mp3/bullet.mp3",
    volume: 0.1,
    velocity: 1800, //Scale from 1 - 2000
    dmg: 1
};
function shoot() {
    if (me.ammo <= 0) return;
    me.ammo = me.ammo - 1;
    //Sound
    let audio = new Audio();
    audio.src = projectile.sound;
    audio.volume = projectile.volume;
    audio.play();
    //Functionality
    let angle = calcAngle(me, mouse) - 90;
    let bullet = {};
    bullet.x = me.x + (me.size / 2);
    bullet.y = me.y + (me.size / 2);
    bullet.speedX = Math.cos(angle / 180 * Math.PI) * 5 * projectile.speed;
    bullet.speedY = Math.sin(angle / 180 * Math.PI) * 5 * projectile.speed;
    bullets.push(bullet);
}

//Calculate angle
function calcAngle(from, to) {
    return Math.atan2(to.x - (from.x + (from.size / 2)), - (to.y - (from.y + (from.size / 2)))) * (180 / Math.PI);
}

//Take damage function
function takeDmg(fromWho) {
    enemies.splice(fromWho, 1);
    me.hp = me.hp - 1;
    me.percentHp = me.hp / me.maxHp;

    me.bleeding = true;
    setTimeout(function () { me.bleeding = false }, 200);

    if (me.hp == 0) location.reload();
}

//Spawn ammo function
var ammonition = [];
var ammoInfo = {
    size: 30,
    ammount: 50,
    sound: "content/mp3/reload.mp3",
    volume: 1,
    spawnrate: 5
}
function spawnAmmo() {
    let random = Math.random();
    let ranX = Math.floor(Math.random() * canvas.width);
    let ranY = Math.floor(Math.random() * canvas.height);
    if (ranX + ammoInfo.size > canvas.width) ranX = canvas.width - ammoInfo.size;
    if (ranY + ammoInfo.size > canvas.height) ranY = canvas.height - ammoInfo.size;
    let ammo = { x: ranX, y: ranY }
    ammonition.push(ammo);
}
setInterval(function () {
    spawnAmmo();
}, ammoInfo.spawnrate * 1000);
function lootedAmmo(i) {
    //Sound
    let audio = new Audio();
    audio.src = ammoInfo.sound;
    audio.volume = ammoInfo.volume;
    audio.play();
    //Functionality
    me.ammo = me.ammo + ammoInfo.ammount;
    ammonition.splice(i, 1);
}
//Spawn health function
var heals = [];
var healInfo = {
    size: 30,
    ammount: (me.maxHp / 100) * 50,
    sound: "content/mp3/reload.mp3",
    volume: 1,
    spawnrate: 20
}
function spawnHealth() {
    let random = Math.random();
    let ranX = Math.floor(Math.random() * canvas.width);
    let ranY = Math.floor(Math.random() * canvas.height);
    if (ranX + healInfo.size > canvas.width) ranX = canvas.width - healInfo.size;
    if (ranY + healInfo.size > canvas.height) ranY = canvas.height - healInfo.size;
    let health = { x: ranX, y: ranY }
    heals.push(health);
}
setInterval(function () {
    spawnHealth();
}, healInfo.spawnrate * 1000);
function lootedHealth(i) {
    //Sound
    let audio = new Audio();
    audio.src = healInfo.sound;
    audio.volume = healInfo.volume;
    audio.play();
    //Functionality
    me.hp = me.hp + healInfo.ammount;
    if (me.hp > me.maxHp) me.hp = me.maxHp;
    me.percentHp = me.hp / me.maxHp;
    heals.splice(i, 1);
}

//Check for collision
function detectCollision(a, b) {
    //Is a inside b
    if (a.x > b.x && a.x < b.x + b.size && a.y > b.y && a.y < b.y + b.size) return true; //Top left corner
    else if (a.x + a.size > b.x && a.x + a.size < b.x + b.size && a.y > b.y && a.y < b.y + b.size) return true; //Top Right corner
    else if (a.x > b.x && a.x < b.x + b.size && a.y + a.size > b.y && a.y + a.size < b.y + b.size) return true; //bottom left corner
    else if (a.x + a.size > b.x && a.x + a.size < b.x + b.size && a.y + a.size > b.y && a.y + a.size < b.y + b.size) return true; //bottom right corner
    //Is b inside a
    else if (b.x > a.x && b.x < a.x + a.size && b.y > a.y && b.y < a.y + a.size) return true; //Top left corner
    else if (b.x + b.size > a.x && b.x + b.size < a.x + a.size && b.y > a.y && b.y < a.y + a.size) return true; //Top Right corner
    else if (b.x > a.x && b.x < a.x + a.size && b.y + b.size > a.y && b.y + b.size < a.y + a.size) return true; //bottom left corner
    else if (b.x + b.size > a.x && b.x + b.size < a.x + a.size && b.y + b.size > a.y && b.y + b.size < a.y + a.size) return true; //bottom right corner
}

//Calculate deltatime
var lastCalledTime;
function setDeltaTime() {
    if (!lastCalledTime) {
        lastCalledTime = new Date().getTime();
        return;
    }
    deltaTime = (new Date().getTime() - lastCalledTime) / 1000;
    lastCalledTime = new Date().getTime();
}

//Handles all functionality
requestAnimationFrame(handler);
function handler() {
    //Calculate deltatime
    setDeltaTime();

    //Player speed calculation
    let angle = calcAngle(me, mouse) - 90;
    me.speedX = Math.cos(angle / 180 * Math.PI) * 5 * me.speed;
    me.speedY = Math.sin(angle / 180 * Math.PI) * 5 * me.speed;
    if (keys.w == true && me.y > 0) me.y = me.y - me.speed * deltaTime;
    if (keys.a == true && me.x > 0) me.x = me.x - me.speed * deltaTime;
    if (keys.s == true && me.y + me.size < canvas.height) me.y = me.y + me.speed * deltaTime;
    if (keys.d == true && me.x + me.size < canvas.width) me.x = me.x + me.speed * deltaTime;

    //Player angle calculation
    me.deg = calcAngle(me, mouse);

    //Enemy angle calculation
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        enemy.deg = calcAngle(enemy, me);
    }

    //Enemy movement
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        let angle = calcAngle(enemy, me) - 90;
        enemy.speedX = Math.cos(angle / 180 * Math.PI) * 5 * enemy.speed;
        enemy.speedY = Math.sin(angle / 180 * Math.PI) * 5 * enemy.speed;
        enemy.x = enemy.x + enemy.speedX * deltaTime;
        enemy.y = enemy.y + enemy.speedY * deltaTime;
    }

    //Bullet movement
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        bullet.x = bullet.x + bullet.speedX;
        bullet.y = bullet.y + bullet.speedY;
    }

    //Check for my collision with enemies
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if (detectCollision(me, enemy)) takeDmg(i);
    }

    //Check for bullet collision
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        //Collision with border
        if (bullet.x < 0 || bullet.y < 0 || bullet.x > canvas.width || bullet.y > canvas.height) {
            bullets.splice(i, 1);
        }
        //Collision with enemy
        for (let i2 = 0; i2 < enemies.length; i2++) {
            let enemy = enemies[i2];
            if (bullet.x > enemy.x && bullet.y > enemy.y && bullet.x < enemy.x + enemy.size && bullet.y < enemy.y + enemy.size) {
                bullets.splice(i, 1);
                enemy.hp = enemy.hp - projectile.dmg;
                if (enemy.hp <= 0) {
                    enemies.splice(i2, 1);
                }
            }
        }
    }

    //Check for collision with ammo
    for (let i = 0; i < ammonition.length; i++) {
        let ammo = ammonition[i];
        if (detectCollision(me, ammo)) lootedAmmo(i);
    }

    //Check for collision with health
    for (let i = 0; i < heals.length; i++) {
        let heal = heals[i];
        if (detectCollision(me, heal)) lootedHealth(i);
    }

    //Highscore
    let highScore = localStorage.getItem("highScore");
    if (localStorage.getItem("highScore") == null) localStorage.setItem("highScore", time);
    else if (highScore < time) {
        localStorage.setItem("highScore", time);
    }
    requestAnimationFrame(handler);
    render();
};

//Render canvas
function render() {
    //clear canvas
    canvas.width = canvas.width;

    //Draw bleeding border
    if (me.bleeding == true) {
        context.strokeStyle = 'red';
    }

    //Draw bullets
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        context.fillStyle = projectile.color;
        context.beginPath();
        context.arc(bullet.x, bullet.y, projectile.size, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    }

    //Draw player
    context.fillStyle = me.color;
    context.translate(me.x + (me.size / 2), me.y + (me.size / 2));
    context.rotate(me.deg * Math.PI / 180);
    context.translate(-(me.x + (me.size / 2)), -(me.y + (me.size / 2)));
    context.fillRect(me.x, me.y, me.size, me.size);
    context.beginPath();
    context.moveTo(me.x, me.y + (me.size / 100) * 10);
    context.lineTo(me.x + me.size, me.y + (me.size / 100) * 10);
    context.lineWidth = (me.size / 100) * 20;
    context.stroke();
    context.rect(me.x, me.y, me.size, me.size);
    context.lineWidth = (me.size / 100) * 2;
    context.stroke();
    context.resetTransform();

    //Draw enemies
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        context.strokeStyle = 'black';
        if (enemy.hp == 1) context.fillStyle = "#a19595";
        if (enemy.hp == 2) context.fillStyle = "#9c7e7e";
        if (enemy.hp == 3) context.fillStyle = "#a15454";
        if (enemy.hp == 4) context.fillStyle = "#a32f2f";
        if (enemy.hp == 5) context.fillStyle = "#8a0000";
        context.translate(enemy.x + (enemy.size / 2), enemy.y + (enemy.size / 2));
        context.rotate(enemy.deg * Math.PI / 180);
        context.translate(-(enemy.x + (enemy.size / 2)), -(enemy.y + (enemy.size / 2)));
        context.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
        context.beginPath();
        context.moveTo(enemy.x, enemy.y + (enemy.size / 100) * 10);
        context.lineTo(enemy.x + enemy.size, enemy.y + (enemy.size / 100) * 10);
        context.lineWidth = (enemy.size / 100) * 20;
        context.stroke();
        context.resetTransform();
    }

    //Draw ammo pickups
    for (let i = 0; i < ammonition.length; i++) {
        let ammo = ammonition[i];
        context.fillStyle = "#2b2b2b";
        context.fillRect(ammo.x, ammo.y, ammoInfo.size, ammoInfo.size);
        context.strokeStyle = 'orange';
        context.beginPath();
        context.moveTo(ammo.x + (ammoInfo.size / 100) * 30, ammo.y + (ammoInfo.size / 100) * 20);
        context.lineTo(ammo.x + (ammoInfo.size / 100) * 30, ammo.y + ammoInfo.size - (ammoInfo.size / 100) * 20);
        context.lineWidth = (ammoInfo.size / 100) * 20;
        context.stroke();
        context.beginPath();
        context.moveTo(ammo.x + (ammoInfo.size / 100) * 70, ammo.y + (ammoInfo.size / 100) * 20);
        context.lineTo(ammo.x + (ammoInfo.size / 100) * 70, ammo.y + ammoInfo.size - (ammoInfo.size / 100) * 20);
        context.lineWidth = (ammoInfo.size / 100) * 20;
        context.stroke();
        context.fillStyle = "black";
        context.font = "12px Arial";
        context.textAlign = "center";
        context.fillText(ammoInfo.ammount, ammo.x + (ammoInfo.size / 2), ammo.y - (ammoInfo.size / 100) * 20);
    }

    //Draw health pickups
    for (let i = 0; i < heals.length; i++) {
        let heal = heals[i];

        context.strokeStyle = 'red';
        context.beginPath();
        context.moveTo(heal.x + (healInfo.size / 2), heal.y);
        context.lineTo(heal.x + (healInfo.size / 2), heal.y + healInfo.size);
        context.lineWidth = 10;
        context.stroke();
        context.beginPath();
        context.moveTo(heal.x, heal.y + (healInfo.size / 2));
        context.lineTo(heal.x + healInfo.size, heal.y + (healInfo.size / 2));
        context.lineWidth = 10;
        context.stroke();
        context.fillStyle = "black";
        context.font = "12px Arial";
        context.textAlign = "center"; // 5 / 10 * 100
        context.fillText((healInfo.ammount / me.maxHp) * 100 + "%", heal.x + (healInfo.size / 2), heal.y - (healInfo.size / 100) * 20);
    }

    context.shadowBlur = 0;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
    context.shadowColor = "rgba(0,0,0)";

    //Draw time
    context.fillStyle = "white";
    context.font = "80px Arial";
    context.textAlign = "center";
    context.fillText(time, (canvas.width / 2), 150);
    context.font = "20px Arial";
    context.fillText("Highscore - " + localStorage.getItem("highScore"), (canvas.width / 2), 200);

    //Draw healthbar
    //Black box
    context.fillStyle = "black";
    context.fillRect(me.x, me.y - (me.size / 1.5), me.size, (me.size / 100) * 20);
    //Green box
    context.fillStyle = "red";
    context.fillRect(me.x, me.y - (me.size / 1.5), me.size * me.percentHp, (me.size / 100) * 20);

    //Draw ammoText
    context.fillStyle = "white";
    context.font = "30px Arial";
    context.textAlign = "center";
    context.fillText(me.ammo, me.x + (me.size / 2), me.y + me.size * 1.6);

    //Draw Generel info text
    context.shadowBlur = 0;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
    context.shadowColor = "rgba(0,0,0)";

    context.fillStyle = "white";
    context.font = "20px Arial";
    context.textAlign = "left";
    context.fillText("Weapon upgrade : 60s & 100s", 15, 30);
    context.fillText("Restart [R]", 15, 60);
    if (me.special == true) {
        context.fillText("Special attak [Space] : 1 use", 15, 90);
    }
};