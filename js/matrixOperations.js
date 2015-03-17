function resetMatrix(random) {
    if (random == null) random = false;
    matrix = [];
    highlightMatrix = [];
    totalMatrixScore = 0;

    //matrix = [
    //    0, 1, 0,
    //    1, 1, 1,
    //    0, 1, 2
    //];

    // init matrix and highlight matrix
    for (var row = 0; row < height; row++) {
        for (var col = 0; col < width; col++) {
            matrix[row * width + col] = random ? Math.floor(Math.random() * N) : 0;
            highlightMatrix[row * width + col] = 0;
        }
    }



}

function resetMatrixGraphics() {

    // make graphics
    $("#matrixDiv tbody").html("");
    for (var row = 0; row < height; row++) {
        $("#matrixDiv tbody").append('<tr id="row' + row + '">');
        var newTr = $("#row" + row);
        for (var col = 0; col < width; col++) {

            // add cell in row
            newTr.append('<td id="col' + col + '">');
            var newTd = $("#row" + row + " #col" + col);

            // set base class of neutral highlight
            newTd.addClass("high0");

            // set html to numerical value
            setCellValue(newTd, matrix[row * width + col]);

            // set html to be dwarf guy
            //var dwarfDiv = $("<div>");
            //dwarfDiv.addClass("dwarf");
            //newTd.html(dwarfDiv);


            newTd.on("mousedown", { self: newTd, matrixPos: row * width + col }, mouseDownCell);
            newTd.on("mouseup", { self: newTd, matrixPos: row * width + col }, clickCell);

            newTd.on("mousemove", { self: newTd, matrixPos: row * width + col }, highlightCell);

        }
    }

}

function setCellValue(cell, value) {
    cell.html("<span>" + (value + 1) + "</span>");
}

function getPixelBodyWidth() {
    var h = $(window).height() - $(".table-spacing").height() * 2 - $("#menubar").height();
    var w = $(window).width();
    // grid piece width. max should be a portion of the screen.
    return Math.min(
            w / (width),
            h / (height),
            getMaxCellSize()
        );

}

// resizes cells based on window dimensions.
function resizeGrid(animate) {
    var pixelBodyWidth = getPixelBodyWidth();
    $("#gamediv").css({
        'height': pixelBodyWidth * height + 60
    });
    if (animate === true) {
        $("#gamediv").animate({
            'font-size': Math.floor(pixelBodyWidth * 0.75) + "px"
        }, downsizeAnimationDuration);
        $(".game-width").animate({
            'width': pixelBodyWidth * width
        }, downsizeAnimationDuration);
    } else {
        $("#gamediv").css({
            'font-size': Math.floor(pixelBodyWidth * 0.75) + "px"
        });
        $(".game-width").css({
            'width': pixelBodyWidth * width
        });
    }

    // go through TD's and resize them too
    for (var row = 0; row < height; row++) {
        for (var col = 0; col < width; col++) {
            var td = $("#row" + row + " #col" + col);
            if (animate === true) {
                td.animate({
                    'width': pixelBodyWidth,
                    'height': pixelBodyWidth
                }, downsizeAnimationDuration);
            } else {
                td.css({
                    'width': pixelBodyWidth,
                    'height': pixelBodyWidth
                });
            }
        }
    }

    // resize tiny spacing to fill rest of screen height
    var totalHeight = $("#matrixDiv").height() + $(".table-spacing").height() * 2 + $("#menubar").height();
    $("#tiny-spacing").css({
        'height': $(window).height() - totalHeight
    });
}

// true when similar kernels do not touch
function SimilarKernelsDoNotTouch() {
    // go through highlight matrix, perform grassfire/blob detection. if any blob is larger than 4, kernels touch.
    var numberOfBlobs = GrassFire(highlightMatrix);

    return numberOfBlobs == totalMatrixScore;
}

// returns amount of blobs in matrix. simplified. 
function GrassFire(matrix) {

    // instead of detailed matrix, threshold at 1.
    var simpleMatrix = [];
    for (var i = 0; i < matrix.length; i++) {
        simpleMatrix[i] = matrix[i] == 0 ? 0 : 1;
    }

    var burned = [];
    for (var i = 0; i < matrix.length; i++) {
        burned[i] = 0;
    }
    // 0 is not checked, 1..N is blob(i). If there is a background, it is also considered a blob.
    var blob = 1;
    for (var row = 0; row < height; row++) {
        for (var col = 0; col < width; col++) {
            // burned[i] is 0 when matrix[i] is 0
            if (simpleMatrix[row * width + col] != 0) {
                // start new blob
                var blobSize = GrassfireCheckCell(blob, row, col, simpleMatrix, burned, 0);
                // after this is finished, all blob components were burned.
                if (blobSize > 0) blob++;
            }
        }
    }
    // blob amount is blob-1.
    return blob-1;
   
    // verify
    //for (var row = 0; row < height; row++) {
    //    var s = "";
    //    for (var col = 0; col < width; col++) {
    //        s += burned[row * width + col];
    //    }
    //    console.log(s);
    //}

    //return burned;

}

// for each row and col
// if matrix[x,y]!=0 start blob detection
//     for its neighbors
//         if neighbor is equal to cell, burn and check its neighbors
//         else return number of neighbors burned plus one.
// 

function GrassfireCheckCell(blob, row, col, matrix, burned, blobSize) {

    // check this cell to not check it again later
    if (burned[row * width + col] == 0) {
        burned[row * width + col] = blob;
        blobSize++;

        var cellValue = matrix[row * width + col];

        // for each neighbor
        var neigh;
        if (col + 1 < width) {
            neigh = matrix[row * width + col + 1];
            if (neigh == cellValue) {
                blobSize += GrassfireCheckCell(blob, row, col + 1, matrix, burned, 0);
            }
        }
        if (col - 1 >= 0) {
            neigh = matrix[row * width + col - 1];
            if (neigh == cellValue) {
                blobSize += GrassfireCheckCell(blob, row, col - 1, matrix, burned, 0);
            }
        }
        if (row + 1 < height) {
            neigh = matrix[(row + 1) * width + col];
            if (neigh == cellValue) {
                blobSize += GrassfireCheckCell(blob, row + 1, col, matrix, burned, 0);
            }
        }
        if (row - 1 >= 0) {
            neigh = matrix[(row - 1) * width + col];
            if (neigh == cellValue) {
                blobSize += GrassfireCheckCell(blob, row - 1, col, matrix, burned, 0);
            }
        }
    }

    return blobSize;

}

function getKernelAtPos(matrixPos) {
    var x = matrixPos % width;
    var y = Math.floor(matrixPos / width);

    var i = matrix[y * width + x];
    var up = y > 0 ? matrix[(y - 1) * width + x] : null;
    var dn = y < height - 1 ? matrix[(y + 1) * width + x] : null;
    var le = x > 0 ? matrix[y * width + x - 1] : null;
    var ri = x < width - 1 ? matrix[y * width + x + 1] : null;

    return [
        null, up, null,
        le, i, ri,
        null, dn, null
    ];

}

function getKernelAtPosShape(matrixPos, shape) {
    var x = matrixPos % width;
    var y = Math.floor(matrixPos / width);

    var i = matrix[y * width + x];
    var up = y > 0 ? matrix[(y - 1) * width + x] : null;
    var dn = y < height - 1 ? matrix[(y + 1) * width + x] : null;
    var le = x > 0 ? matrix[y * width + x - 1] : null;
    var ri = x < width - 1 ? matrix[y * width + x + 1] : null;

    return [
        null, shape[1] != 0 ? up : null, null,
        shape[3] != 0 ? le : null, i, shape[5] != 0 ? ri : null,
        null, shape[7] != 0 ? dn : null, null
    ];

}

function calculateHighlightMatrix() {

    var showConsole = false;

    // reset highlight matrix
    for (var i = 0; i < width * height; i++) {
        highlightMatrix[i] = 0;
    }

    var score = 0;

    // compare each kernel with each other kernel
    for (var row = 0; row < height; row++) {
        for (var col = 0; col < width; col++) {

            // take each rotation
            for (var rot = 0; rot < 360; rot += 90) {
                var shapeTowardsDirection = getShapeTowards(rot);
                var k = getKernelAtPosShape(row * width + col, shapeTowardsDirection);
                if (showConsole)
                    console.log("taking ", row, col, k);

                if (!IsCornerKernel(k)) {
                    //console.log("not corner");
                    // compare to every other kernel
                    for (var mrow = 0; mrow < height; mrow++) {
                        for (var mcol = 0; mcol < width; mcol++) {

                            var compareFast = false;
                            if (!compareFast) {
                                // compare thoroughly
                                for (var mrot = 0; mrot < 360; mrot += 90) {
                                    var shapeTowardsMRot = getShapeTowards(mrot);
                                    // mk in each direction
                                    var mk = getKernelAtPosShape(mrow * width + mcol, shapeTowardsMRot);
                                    // compare them with EdgeKernelSimilar
                                    if (showConsole) {
                                        console.log("comparing");
                                        console.log(row, col, k, rot);
                                        console.log(mrow, mcol, mk, mrot);
                                        console.log("result is " + EdgeKernelsSimilar(k, rot, mk, mrot));
                                    }
                                    // if not same cell
                                    if (!(mrow == row && mcol == col)) {

                                        if (EdgeKernelsSimilar(k, rot, mk, mrot)) {
                                            // highlight position of mk
                                            for (var hrow = 0; hrow < 3; hrow++) {
                                                for (var hcol = 0; hcol < 3; hcol++) {
                                                    if (shapeTowardsMRot[hrow * 3 + hcol] != 0) {
                                                        var matIndex = (mrow + hrow - 1) * width + (mcol + hcol - 1);
                                                        if (highlightMatrix[matIndex] != null) {
                                                            highlightMatrix[matIndex]++;
                                                        }
                                                    }
                                                }
                                            }
                                            score++;
                                        }
                                    } else {
                                        // same cell
                                        if (rot != mrot) {
                                            if (EdgeKernelsSimilar(k, rot, mk, mrot)) {
                                                // highlight position of mk
                                                for (var hrow = 0; hrow < 3; hrow++) {
                                                    for (var hcol = 0; hcol < 3; hcol++) {
                                                        if (shapeTowardsMRot[hrow * 3 + hcol] != 0) {
                                                            var matIndex = (mrow + hrow - 1) * width + (mcol + hcol - 1);
                                                            if (highlightMatrix[matIndex] != null) {
                                                                highlightMatrix[matIndex]++;
                                                            }
                                                        }
                                                    }
                                                }
                                                score++;
                                            }
                                        }
                                    }

                                }
                            } else {
                                // compare fast (old version)
                                var mk = getKernelAtPos(mrow * width + mcol);
                                if (showConsole) console.log("    comparing with ", mrow, mcol, mk);
                                var compareResult = kernelsSimilarAtLeastOneRotation(k, mk);
                                if (showConsole) console.log("    result was ", compareResult);
                                if (compareResult != -1) {
                                    if ((mrow != row || mcol != col)) {
                                        if (showConsole) console.log("     happening");
                                        var shapeTowardsMk;
                                        switch (compareResult) {
                                            case 0:
                                                shapeTowardsMk = shapeTowardsDirection;
                                                break;
                                            case 90:
                                                shapeTowardsMk = Get90DegreesCWKernel(shapeTowardsDirection);
                                                break;
                                            case 180:
                                                shapeTowardsMk = Get180DegreesCWKernel(shapeTowardsDirection);
                                                break;
                                            default:
                                                shapeTowardsMk = Get270DegreesCWKernel(shapeTowardsDirection);
                                                break;
                                        }

                                        //console.log("kernel " + row + " " + col + " towards " + rot + " is similar to " + mrow + " " + mcol + " rotated " + compareResult);
                                        //console.log(k, mk);

                                        // highlight the positions of mk
                                        for (var hrow = 0; hrow < 3; hrow++) {
                                            for (var hcol = 0; hcol < 3; hcol++) {
                                                if (shapeTowardsMk[hrow * 3 + hcol] != 0) {
                                                    var matIndex = (mrow + hrow - 1) * width + (mcol + hcol - 1);
                                                    if (highlightMatrix[matIndex] != null) {
                                                        highlightMatrix[matIndex]++;
                                                    }
                                                }
                                            }
                                        }

                                        score++;
                                    }
                                }

                            }
                        }
                    }
                }
            }
        }
    }

    // total matrix score is saved in var score
    setScore(score);

}

function setScore(score) {
    totalMatrixScore = score;
    $("#currentScore span").html(score);
}

function highlightCellsBasedOnMatrix() {
    var divideMethod = false;
    // divide method where cells are lit up based on global maximum
    if (divideMethod) {
        // max highlight is minimum 3
        var max = 3;
        for (var i = 0; i < highlightMatrix.length; i++) {
            if (max < highlightMatrix[i])
                max = highlightMatrix[i];
        }

        for (var row = 0; row < height; row++) {
            for (var col = 0; col < width; col++) {
                // id of cell to search for
                var id = "#row" + row + " #col" + col;
                // remove all classes
                $(id).removeClass();
                // add class from highlightMatrix
                //var newhighlight = Math.ceil(Math.min((highlightMatrix[row * width + col] / max), 3) * 3);
                var newhighlight = Math.ceil(highlightMatrix[row * width + col] / max * 3);
                $(id).addClass("high" + newhighlight);

            }
        }
    } else {
        // linear method where cells are lit up constantly to display their level of duplicity
        for (var row = 0; row < height; row++) {
            for (var col = 0; col < width; col++) {
                // id of cell to search for
                var id = "#row" + row + " #col" + col;
                // remove all classes
                $(id).removeClass();
                // max highlight is 7 - the black one
                var newhighlight = Math.min(highlightMatrix[row * width + col], 10);
                $(id).addClass("high" + newhighlight);
                if (newhighlight >= untouchableLimit) {
                    $(id).addClass("untouchable");
                }
            }
        }


    }
}

function highlightSimilarCells(matrixPos, x, y) {
    var rot = getDiagonalSectionInSquare(x, y);
    var shapeTowardsDirection = getShapeTowards(rot);
    var k = getKernelAtPosShape(matrixPos, shapeTowardsDirection);

    for (var row = 0; row < height; row++) {
        for (var col = 0; col < width; col++) {
            //$("#row" + row + " #col" + col).removeClass("highlighted");
            var el = $("#row" + row + " #col" + col);
            el.css({
                'background-color': "",
                'color': ''
            });

        }
    }

    var checkedMatrix = [];
    for (var i = 0; i < highlightMatrix.length; i++) {
        checkedMatrix[i] = 0;
    }

    for (var mrow = 0; mrow < height; mrow++) {
        for (var mcol = 0; mcol < width; mcol++) {

            var compareFast = false;
            if (compareFast) {
                // find kernels similar to k and highlight them
                var mk = getKernelAtPos(mrow * width + mcol);
                var compareResult = kernelsSimilarAtLeastOneRotation(k, mk);
                if (compareResult != -1) {
                    var shapeTowardsMk;
                    switch (compareResult) {
                        case 0:
                            shapeTowardsMk = shapeTowardsDirection;
                            break;
                        case 90:
                            shapeTowardsMk = Get90DegreesCWKernel(shapeTowardsDirection);
                            break;
                        case 180:
                            shapeTowardsMk = Get180DegreesCWKernel(shapeTowardsDirection);
                            break;
                        default:
                            shapeTowardsMk = Get270DegreesCWKernel(shapeTowardsDirection);
                            break;
                    }

                    // highlight the positions of mk
                    for (var hrow = 0; hrow < 3; hrow++) {
                        for (var hcol = 0; hcol < 3; hcol++) {
                            if (shapeTowardsMk[hrow * 3 + hcol] != 0) {
                                var elrow = mrow + hrow - 1;
                                var elcol = mcol + hcol - 1;
                                if (matrix[elrow * width + elcol] != null) {
                                    if (checkedMatrix[elrow * width + elcol] == 0) {
                                        checkedMatrix[elrow * width + elcol] = 1;
                                        // highlight element at matindex
                                        //$("#row" + elrow + " #col" + elcol).addClass("highlighted");
                                        var el = $("#row" + elrow + " #col" + elcol);
                                        var rgb = el.css('background-color');
                                        rgb = rgb.replace(/[^\d,]/g, '').split(',');
                                        var newrgb = "rgb("
                                            + Math.floor(parseInt(rgb[0]) * highlightColorMultiplier) + ", "
                                            + Math.floor(parseInt(rgb[1]) * highlightColorMultiplier) + ", "
                                            + Math.floor(parseInt(rgb[2]) * highlightColorMultiplier) + ")"
                                        ;
                                        //console.log(newrgb);
                                        el.css({
                                            'background-color': newrgb
                                        });
                                    }
                                }
                            }
                        }
                    }
                    
                }
            } else {

                // compare thoroughly
                for (var mrot = 0; mrot < 360; mrot += 90) {
                    // for each rotation of other
                    var shapeTowardsMRot = getShapeTowards(mrot);
                    // mk in each direction
                    var mk = getKernelAtPosShape(mrow * width + mcol, shapeTowardsMRot);
                    // compare them with EdgeKernelSimilar
                    if (EdgeKernelsSimilar(k, rot, mk, mrot)) {
                        // highlight the positions of mk
                        for (var hrow = 0; hrow < 3; hrow++) {
                            for (var hcol = 0; hcol < 3; hcol++) {
                                if (shapeTowardsMRot[hrow * 3 + hcol] != 0) {
                                    var elrow = mrow + hrow - 1;
                                    var elcol = mcol + hcol - 1;
                                    if (matrix[elrow * width + elcol] != null) {
                                        if (checkedMatrix[elrow * width + elcol] == 0) {
                                            checkedMatrix[elrow * width + elcol] = 1;
                                            // highlight element at matindex
                                            //$("#row" + elrow + " #col" + elcol).addClass("highlighted");
                                            var el = $("#row" + elrow + " #col" + elcol);
                                            var rgb = el.css('background-color');
                                            rgb = rgb.replace(/[^\d,]/g, '').split(',');
                                            var newrgb = "rgb("
                                                + Math.floor(parseInt(rgb[0]) * highlightColorMultiplier) + ", "
                                                + Math.floor(parseInt(rgb[1]) * highlightColorMultiplier) + ", "
                                                + Math.floor(parseInt(rgb[2]) * highlightColorMultiplier) + ")"
                                            ;
                                            //if (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2]) < 128) {
                                            //    el.css({
                                            //        'color': 'white'
                                            //    });
                                            //}
                                            //console.log(newrgb);
                                            el.css({
                                                'background-color': newrgb
                                            });
                                        }
                                    }
                                }
                            }
                        }

                    }
                }

            }
        }
    }
}

// shape towards direction, meaning the 010 is towards trigo angle direction.
//                                      111
function getShapeTowards(direction) {
    return [
        0, direction != 270 ? 1 : 0, 0,
        direction != 0 ? 1 : 0, 1, direction != 180 ? 1 : 0,
        0, direction != 90 ? 1 : 0, 0
    ];
}

function getDiagonalSectionInSquare(x, y) {
    if (x + y > 1) {
        if (x > y) {
            return 0;
        } else {
            return 270;
        }
    } else {
        if (x > y) {
            return 90;
        } else {
            return 180;
        }
    }
}

function IsMatrixSolved() {
    return totalMatrixScore == 0;
}

// 0-360 if similar. represents rotation needed of kernel2 so that it is similar to kernel1.
function kernelsSimilarAtLeastOneRotation(edgeKernel, fullShapeKernel) {
    // not for corner kernels
    if (IsCornerKernel(edgeKernel) || IsCornerKernel(fullShapeKernel)) {
        // a corner kernel is always different.
        return -1;
    }

    if (IsEdgeKernel(fullShapeKernel)) {
        // edge kernels are tricky

    }

    // target kernel similar but rotated 90 CW or 270 CCW
    if (KernelsSimilar(edgeKernel, Get90DegreesCWKernel(fullShapeKernel))) {
        return 270;
    }

    if (KernelsSimilar(edgeKernel, Get180DegreesCWKernel(fullShapeKernel))) {
        return 180;
    }

    if (KernelsSimilar(edgeKernel, Get270DegreesCWKernel(fullShapeKernel))) {
        return 90;
    }
    // target kernel similar in the same rotation
    if (KernelsSimilar(edgeKernel, fullShapeKernel)) {
        return 0;
    }

    return -1;

}

function IsCornerKernel(kernel) {
    var countMinusOnes = 0;
    for (var i = 0; i < kernel.length; i++) {
        if (kernel[i] === null) countMinusOnes++;
    }
    return countMinusOnes >= 6;
}

function IsEdgeKernel(kernel) {
    var countMinusOnes = 0;
    for (var i = 0; i < kernel.length; i++) {
        if (kernel[i] === null) countMinusOnes++;
    }
    return countMinusOnes == 5;
}

function EdgeKernelsSimilar(kernel1, rot1, kernel2, rot2) {
    if (IsCornerKernel(kernel1) || IsCornerKernel(kernel2)) {
        // a corner kernel is always different.
        return false;
    }
    // kernel1 is rotated towards rot1, meaning we have to rotate kernel2 by -rot2 (neutral) + rot1
    var kernel2AdjustmentRotation = (rot2 - rot1);

    var newKernel = GetRotatedKernel(kernel2AdjustmentRotation, kernel2);

    return KernelsSimilar(kernel1, newKernel);

}

function KernelsSimilar(kernel1, kernel2) {
    // for each index
    for (var i = 0; i < kernel1.length; i++) {
        if (kernel1[i] !== null) {
            if (kernel1[i] !== kernel2[i]) {
                return false;
            }
        }
    }
    return true;
}

function GetRotatedKernel(degrees, k) {
    degrees = (degrees + 720) % 360; // prevent negative angles
    if (degrees == 0) return k;
    else if (degrees == 90) return [
        k[6], k[3], k[0],
        k[7], k[4], k[1],
        k[8], k[5], k[2],
    ]; else if (degrees == 180) return [
        k[8], k[7], k[6],
        k[5], k[4], k[3],
        k[2], k[1], k[0],
    ]; else if (degrees == 270) return [
        k[2], k[5], k[8],
        k[1], k[4], k[7],
        k[0], k[3], k[6],
    ];
}

function Get90DegreesCWKernel(k) {
    return [
        k[6], k[3], k[0],
        k[7], k[4], k[1],
        k[8], k[5], k[2],
    ];
}

function Get180DegreesCWKernel(k) {
    return [
        k[8], k[7], k[6],
        k[5], k[4], k[3],
        k[2], k[1], k[0],
    ];
}

function Get270DegreesCWKernel(k) {
    return [
        k[2], k[5], k[8],
        k[1], k[4], k[7],
        k[0], k[3], k[6],
    ];
}