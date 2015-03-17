function optimizeCell(matrixPos) {
    if (optimizeCellActive) {
        numOptimizeCells++;

        // our cell
        var x = matrixPos % width;
        var y = Math.floor(matrixPos / width);
        var cell = $("#row" + y + " #col" + x);

        // clear highlight


        // animate cell down
        cell.animate({
            'font-size': '50%'
        }, 50, function () {

            // from 0 to N, try out, choose best score
            var bestScore = totalMatrixScore;
            var bestVal = matrix[matrixPos];
            var originalVal = bestVal;
            for (var n = N + originalVal; n >= originalVal + 1 ; n--) {
                // cycle through values until same is reached.
                var nm = n % N;
                matrix[matrixPos] = nm;
                calculateHighlightMatrix();
                // when matrix score is better or equal
                if (bestScore >= totalMatrixScore) {
                    // only save new position when it is different from original
                    if (nm != originalVal) {
                        bestScore = totalMatrixScore;
                        bestVal = nm;
                    }
                }
            }

            // at this point, bestVal, even if not changed, is the best choice for matrix[matrixPos]
            matrix[matrixPos] = bestVal;

            // find element and change its value also.
            setCellValue(cell, bestVal);

            matrixUpdated();

            // animate cell up
            cell.animate({
                'font-size': cellHighlightFontSizes[highlightMatrix[matrixPos]] + "%"
            }, 50, function () {
                // remove styles from element so css can take over
                cell.css('font-size', "");

                // add green to symbolize that cell is optimized
                //cell.addClass("optimized");
                //cell.css("color", "#1e8f24");
            });

        });
    }
}

