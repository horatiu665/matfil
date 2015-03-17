
// logs clicks and other data about playthrough
startLogs();


// init all logs
function startLogs() {
    // log clicks
    $(document).on("click", function () {
        numClicks++;
    });

    // log optimizeCells


}

var numClicks = 0;
var numOptimizeCells = 0;