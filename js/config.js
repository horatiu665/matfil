function resetToDefaultValues() {
    width = 5;
    height = 5;
    N = 5;
    gRandomizeMatrix = true;
    tutorial1Happened = false;
    tutorial2Happened = false;
    tutorial3Happened = false;
    optimizeCellActive = false;

    
}

var width = 5;
var height = 5;
var N = 5;
var gRandomizeMatrix = true;

var untouchableLimit = 5;

// set at default.js initially, and can be loaded from server.
var sessionId = 12345;
function setSessionId(value) {
    sessionId = value;

    // set link in page too
    var link = document.location.href;
    if (document.location.search.length > 0) link = link.substring(0, link.indexOf(document.location.search));
    $("#sessionIdLink").val(link + "?sessionId=" + sessionId);

}

function setRandomSessionId() {
    setSessionId(Math.floor(Math.random() * 10000000).toString()
        + Math.floor(Math.random() * 10000000).toString()
        + Math.floor(Math.random() * 10000000).toString());

}

var playerName = "YourNameHere";
function setPlayerName(newName) {
    newName = newName.substring(0, 12);
    playerName = newName;
    var playerNameDiv = $("#playerNameDiv");
    playerNameDiv.html('<span id="nameSpan">' + newName + "</span>");

}


var nextLevelAlwaysUnsolved = true;

function getNextLevelValues() {
    return {
        width: width + 1,
        height: height + 1
    };
}

// every X amount of clicks/operations, the highscores reset.
var refreshHighscoreDuration = 10000;
var refreshHighscoreTimer = -1; // timer handler ?not sure if necessary


// when true, optimizeCell button appears and right click optimizes cells.
var optimizeCellActive = false;

// first tutorial happens instantly after initTutorial() in start.js
var tutorialLevels = [0, 6, 7];

var tutorial1Happened = false;
var tutorial2Happened = false;
var tutorial3Happened = false;



var highlightColorMultiplier = 0.65;
var downsizeAnimationDuration = 200;
var upsizeAnimationDuration = 500;

var cellHighlightFontSizes = [76, 80, 88, 100];

var bodyFontSize = 16;

// gets minimum size in pixels of a cell (width = height).
function getMinCellSize() {
    return 50;
}

function getMaxCellSize() {
    return 120;
}

function overlayAndContinueNoClicks(condition, displayMessage, callback) {
    if (condition) {
        // disable clicks
        $('td').unbind("mousedown");
        $('td').unbind("mouseup");

        overlayAndContinue(condition, displayMessage, function () {
            // reenable clicks and THEN callback
            for (var row = 0; row < height; row++) {
                for (var col = 0; col < width; col++) {
                    var td = $("#row" + row + " #col" + col);
                    td.on("mousedown", { self: td, matrixPos: row * width + col }, mouseDownCell);
                    td.on("mouseup", { self: td, matrixPos: row * width + col }, clickCell);

                }
            }

            callback();

        });
    } else {
        callback();
    }
}

// shows a message on screen and continues execution of callback. done at next level passes.
// repeatVariable - boolean: when false, event happens, when true does not.
// displayMessage - display this with an OK button
// callback - function to call after player presses 'OK'
function overlayAndContinue(condition, displayMessage, callback) {
    if (condition) {
        
        // show window "now you can right click shit blabla"
        // when user presses OK, activate and continue
        var overlayBG = $("<div>");
        overlayBG.addClass("overlayBG");
        var overlay = $("<div>");
        overlay.addClass("overlay");
        overlay.append('<div style="width:' + $("#gamediv").width() + 'px; margin:auto">');
        overlay.find("div").append("<p>" + displayMessage + "</p>");
        var okButtonId = "okButton";
        overlay.find("div").append('<div><input type="submit" value="OK" id="' + okButtonId + '"></input></div>');
        overlay.css({
            'opacity': 0
        });
        overlayBG.css({
            'opacity': 0
        });

        $("body").append(overlayBG);
        $("body").append(overlay);
        overlayBG.css({
            'height': overlay.height() + (overlay.offset().top - overlayBG.offset().top) * 2
        });
        console.log(overlay.height());
        overlay.animate({
            'opacity': 1
        }, 200);
        overlayBG.animate({
            'opacity': 0.7
        });

        overlay.find("#okButton").on("click", function () {
            overlay.remove();
            overlayBG.remove();
            callback();
        });
    } else {
        callback();
    }
}



var dwarfAnimDuration = 1000;
var dwarfFrameDuration = 100;
var dwarfFrameWidth = 32;
var dwarfFrameHeight = 64;
var dwarfAnimStart = 64;
var dwarfAnimEnd = 192;