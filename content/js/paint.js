//http://jsfiddle.net/h1Labpnb/18/

//define canvas
var canvas = $("canvas")[0];
var context = canvas.getContext("2d");

//canvas width & height
canvas.width = 998;
canvas.height = 550;

//page x, y & mouseDown
var mouseDown;
var pageX;
var pageY;

//brushColor & brushSize
var brushColor;
var brushSize;

//colorTable & imgFiles
var colorTable = ["#16A085", "#2ECC71", "#27AE60", "#3498DB", "#2980B9", "#9B59B6", "#8E44AD", "#34495E", "#2C3E50", "#1F2B38", "#F1C40F", "#F39C12", "#E67E22", "#D35400", "#E74C3C", "#C0392B", "#EB0062", "#D50059", "#BB004E", "#A20044", "#fff", "#f1f1f1", "#DADADA", "#c0c0c0", "#8F8F8F", "#6E6E6E", "#5A5A5A", "#424242", "#2b2b2b", "#000"];
var imgFiles = [];

//onload functions
resetCanvas(true, "#fff");
setBrushColor("#000");
setBrushSize(50, "round");


//setBrushColor
function setBrushColor(color) {
    context.fillStyle = color;
    context.strokeStyle = color;
    $('#activeColor').css('background-color', color);
}

//setBrushSize
function setBrushSize(size, type) {
    context.lineWidth = size;
    context.lineCap = type ? type : "round";
    $('#txtBrushSize').val(size);
}

//resetCanvas
function resetCanvas(reset, background) {
    if (!reset) {
        var img = new Image();
        imgFiles.pop();
        img.src = imgFiles[imgFiles.length - 1];
        context.drawImage(img, 0, 0);
    }
    else {
        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = background ? background : "#fff";
        context.fill();
        setBrushColor(context.strokeStyle);
        imgFiles = [];
        imgSave();
    }
}

//save current image to 'imgFiles'
function imgSave() {
    imgFiles.push(canvas.toDataURL("image/png"));
}

//mouseup & mouseleave
$(canvas).on("mouseup mouseleave", function () {
    if (mouseDown) {
        imgSave();
    }
    mouseDown = false;
});

//mousedown !DRAW
$(canvas).on("mousedown", function (e) {
    mouseDown = true;
    pageX = e.pageX - 1 - this.offsetLeft;
    pageY = e.pageY - 1 - this.offsetTop;
    context.beginPath();
    context.arc(pageX, pageY, context.lineWidth / 2, 0, 2 * Math.PI);
    context.fill();
});

//mousemove !DRAW
$(canvas).on("mousemove", function (e) {
    if (mouseDown) {
        context.beginPath();
        context.moveTo(pageX, pageY);
        pageX = e.pageX - 1 - this.offsetLeft;
        pageY = e.pageY - 1 - this.offsetTop;
        context.lineTo(pageX, pageY);
        context.stroke();
    }
});

//brush size value field
$("#txtBrushSize").on("keyup", function () {
    if ($(this).val().match(/^\d+$/)) {
        setBrushSize($(this).val());
    }
});

//reset last draw (ctrl + z)
$(window).keydown(function (e) {
    if (e.ctrlKey && e.which === 90 && imgFiles.length > 1) {
        event.preventDefault();
        resetCanvas(false);
    }
});

//clear canvas
$("#btnCleanCanvas").on("mousedown", function () {
    if (window.confirm("Clear canvas?")) {
        resetCanvas(true);
    }
});

//set custom color
$('#activeColor').on("mousedown", function () {
    setBrushColor(prompt("Custom color?"));
});

//create colorTable
var i;
for (i = 0; i < colorTable.length; i++) {
    $('#colorTable').append('<li name="' + colorTable[i] + '" style="background-color:' + colorTable[i] + ';"></li>');
}

//set brushColor to 'chosen color'
$("#colorTable li").on("mousedown", function (event) {
    setBrushColor($(this).attr('name'));
});

//brush size value field - regular expression (regex)
var lilBrushSize = $("#txtBrushSize");
$(lilBrushSize).on("keyup", function () {
    if (lilBrushSize.val().match(/^\d+$/)) {
        setBrushSize(lilBrushSize.val());
    }
});

//brush size 'plus' - regular expression (regex)
$("#btnBrushSizePlus").on("mousedown", function () {
    if (lilBrushSize.val().match(/^\d+$/)) {
        if (lilBrushSize.val() >= 100) {
            setBrushSize(context.lineWidth + 100);
        }
        else if (lilBrushSize.val() >= 10) {
            setBrushSize(context.lineWidth + 10);
        }
        else if (lilBrushSize.val() == 0) {
            setBrushSize(1);
        }
        else {
            setBrushSize(context.lineWidth + 1);
        }
    }
});

//brush size 'minus' - regular expression (regex)
$("#btnBrushSizeMinus").on("mousedown", function () {
    if (lilBrushSize.val().match(/^\d+$/)) {
        if (lilBrushSize.val() >= 200) {
            setBrushSize(context.lineWidth - 100);
        }
        else if (lilBrushSize.val() >= 20) {
            setBrushSize(context.lineWidth - 10);
        }
        else if (lilBrushSize.val() > 1) {
            setBrushSize(context.lineWidth - 1);
        }
    }
});