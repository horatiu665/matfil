﻿(function () {
    "use strict";

    console.log("app started");

    $("#matrixDiv tbody").append("tr");



    // http://stackoverflow.com/questions/950087/include-a-javascript-file-in-another-javascript-file
    // loading a script dynamically the safe way without bullshit plugins
    function loadScript(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    }

})();
