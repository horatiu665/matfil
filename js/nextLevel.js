
// nextLevel
function nextLevel(rows, cols, random) {
    if (random == null) random = false;

    // save old matrix in database (for science!)
    if (width >= 10)
        saveMatrixToServer(matrix, getPlayerName());

    var newMatrix = [];

    // unbind mousemove
    // unbind highlightCell until this is done - it's gonna be bound later anyway
    $("td").unbind("mousemove");

    // take rows and cols of matrix, put them in new matrix, add or remove rows and cols.
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            if (row < height && col < width) {
                // add old value in respective position.
                newMatrix[row * rows + col] = matrix[row * width + col];

            } else {
                newMatrix[row * rows + col] = random ? Math.floor(Math.random() * N) : 0;
            }
        }
    }

    matrix = newMatrix;

    var oldWidth = width;
    var oldHeight = height;

    width = cols;
    height = rows;

    // checks for second tutorial
    if (width >= tutorialLevels[1]) {
        $("#currentScore").show();
    }
    overlayAndContinue(false, ""
    //overlayAndContinue(!tutorial2Happened && width >= tutorialLevels[1],
    //"The score displayed at the bottom of the screen is the number of duplicates on the board. " +
    //"When there are 0 duplicates left, you will continue to the next level. </p><p>" +
    //'Click on "YourNameHere" to set your name for the highscores. </p><p>' +
    //'Smaller scores are better. Higher levels are better. '
    , function () {
        if (width >= tutorialLevels[1]) {
            tutorial2Happened = true;

        }
        overlayAndContinue(false,
        //overlayAndContinue(!tutorial3Happened && width >= tutorialLevels[2],
            //playerName != "YourNameHere" ? "You can resume this play session " +
            //"if you bookmark/copy the link below the menu-bar (scroll down)." :
            //'If you enter your name by clicking on "YourNameHere", '+
            //'you can save the play session and resume it later by bookmarking/copying the link below (scroll down)'
            ""
            , function () {
                if (width >= tutorialLevels[2]) {
                    tutorial3Happened = true;
                }
                // checks for activating OptimizeCell advanced feature
                overlayAndContinue(!optimizeCellActive && width >= 10,
                    "From now on you can right click on a cell"
                    + " to choose the optimal value in that cell"
                    , function () {
                        if (width >= 10) {
                            optimizeCellActive = true;
                        }

                        resizeGrid(true);

                        setTimeout(function () {

                            resetMatrixGraphics();
                            resizeGrid();
                            calculateHighlightMatrix();

                            // reset until totalMatrixScore is not zero
                            if (random) {
                                while (totalMatrixScore == 0 && nextLevelAlwaysUnsolved) {
                                    for (var row = 0; row < height; row++) {
                                        for (var col = 0; col < width; col++) {
                                            if (row >= oldHeight || col >= oldWidth) {
                                                matrix[row * width + col] = Math.floor(Math.random() * N);
                                            }
                                        }
                                    }
                                    calculateHighlightMatrix();
                                }
                            }

                            highlightCellsBasedOnMatrix();

                            var pixelBodyWidth = getPixelBodyWidth();
                            // show new cells slowly
                            for (var row = 0; row < rows; row++) {
                                for (var col = 0; col < cols; col++) {
                                    if (row >= oldHeight || col >= oldWidth) {
                                        // hide them all instantly
                                        var cell = $("#row" + row + " #col" + col);
                                        //cell.find("span").css({
                                        //    'font-size': 0
                                        //});
                                        cell.hide();
                                        cell.show(upsizeAnimationDuration);
                                        //cell.css({
                                        //    'width': 0,
                                        //    'height': 0
                                        //});
                                        //cell.animate({
                                        //    'width': pixelBodyWidth,
                                        //    'height': pixelBodyWidth
                                        //}, upsizeAnimationDuration);
                                        //cell.find("span").animate({
                                        //    'font-size': 100 + "%"
                                        //}, upsizeAnimationDuration, function () {
                                        //    cell.find("span").css('font-size', '');
                                        //});
                                    }
                                }
                            }

                            // TODO: fix excess of xmlhttp requests
                            // save session after new level is over.
                            //saveSessionToServer();

                        }, downsizeAnimationDuration);
                    });
            });
    });
}
