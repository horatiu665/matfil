
// create grid
// populate grid with default matrix
// populate image list
// create controls, assign events

var matrix = [];
var highlightMatrix = [];
var totalMatrixScore = 0;

function resetGame() {
    // to reset game: clear cookies and start tutorial
    resetAllCookies();

    // reset all values as found in config 
    resetToDefaultValues();

    // also reset any tutorials that might be on the screen
    $(".overlay").remove();
    $(".overlayBG").remove();

    // reset/delete other overlays if there are any

    initTutorial();
}

function initTutorial() {

    // set sessionId for new players
    setRandomSessionId();

    //$("#currentScore").hide();

    resetMatrix(gRandomizeMatrix);

    resetMatrixGraphics();

    calculateHighlightMatrix();

    if (gRandomizeMatrix) {
        while (totalMatrixScore != 2 || !SimilarKernelsDoNotTouch()) {

            resetMatrix(gRandomizeMatrix);

            resetMatrixGraphics();

            calculateHighlightMatrix();
        }
    }

    // resize window event
    $(window).resize(resizeGrid);
    resizeGrid();

    highlightCellsBasedOnMatrix();

    overlayAndContinueNoClicks(!tutorial1Happened,
        "Scroll down for instructions </p><p>"
        , function () {
            tutorial1Happened = true;
        });

}

function initRegular() {

    if (matrix.length != width * height) {
        resetMatrix(gRandomizeMatrix);
    }

    resetMatrixGraphics();

    calculateHighlightMatrix();

    // resize window event
    $(window).resize(resizeGrid);
    resizeGrid();

    highlightCellsBasedOnMatrix();

}

function mouseDownCell(event) {
    var self = event.data.self;
    if (event.which == 1) {
        var cell = $(self);
        // set pressed style
        cell.css("font-size", "70%");
            
        $(document).one("mouseup", function () {
            cell.css("font-size", "");
        });
    }

}

// happens when a cell is clicked. self = the cell element.
function clickCell(event) {
    var self = event.data.self;

    // if left mouse button, else right mouse button
    if (event.which == 1) {

        // unbind highlightCell until this is done
        $(self).unbind("mousemove");

        // get value in td cell
        var x = event.data.matrixPos;

        // move dwarf dude
        //var dwarfDiv = $(self).find(".dwarf");

        // remove old VALUE css
        //dwarfDiv.removeClass("val" + matrix[x]);

        // increment matrix value
        matrix[x]++;
        if (matrix[x] >= N) matrix[x] = 0;

        setCellValue($(self), matrix[x]);

        // add new VALUE css
        //dwarfDiv.addClass("val" + matrix[x]);

        //animateDwarf(dwarfDiv);

        matrixUpdated();

        // rebind highlightCell because this is done
        $(self).on("mousemove", { self: self, matrixPos: x }, highlightCell);

    } else if (event.which == 3) {

        optimizeCell(event.data.matrixPos);

    }

}

function matrixUpdated() {
    calculateHighlightMatrix();
    highlightCellsBasedOnMatrix();

    // save to cookie just in case.
    saveSessionToCookie();

    // TODO: fix xmlhttp requests being too often.
    // save highscore if player name was set
    //saveSessionToServer();

    checkForWinning();

}


function checkForWinning() {
    if (totalMatrixScore == 0) {
        $("td").unbind("mouseup");
        $("td").unbind("mousedown");
        setTimeout(function () {
            // we won
            var nl = getNextLevelValues();
            nextLevel(nl.height, nl.width, gRandomizeMatrix);
        }, 2000);
    }

}

// happens when mouse moves over a cell.
function highlightCell(event) {
    var self = event.data.self;
    var x = event.clientX - $(self).offset().left;
    x /= $(self).width();
    var y = event.clientY + window.pageYOffset - $(self).offset().top;
    y /= $(self).height();

    highlightSimilarCells(event.data.matrixPos, x, y);

}


// omnipresent scriptloader
function loadScript(url, callback) { var a = document.createElement('script'); a.src = url; a.onreadystatechange = callback; a.onload = callback; $('head')[0].appendChild(a); }
