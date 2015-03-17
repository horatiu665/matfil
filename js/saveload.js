// returns string of numbers representing matrix
function encodeMatrix(matrixToEncode) {
    if (matrixToEncode == null) matrixToEncode = matrix;
    var s = "";
    for (var i = 0; i < matrixToEncode.length; i++) {
        s += matrixToEncode[i] + " ";
    }
    return s;
}

// returns matrix
function decodeMatrix(encodedString) {

    var splitstr = encodedString.split(' ');
    var decoded = [];
    for (var i = 0; i < width * height; i++) {
        decoded[i] = parseInt(splitstr[i]);
    }
    return decoded;
}

function getPlayerName() {
    if ($("#nameSpan").length) {
        return $("#nameSpan").html();
    }
    return playerName;
}

function removeAnnoyingShit(text) {
    if (text.indexOf("<!-- Hosting24") >= 0) {
        return text.substring(0, text.indexOf("<!-- Hosting24"));
    } else {
        return text;
    }
}

// sends request to php to save matrix
function saveMatrixToServer(matrixToSend, playerName) {
    try {
        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.status == 200) {
                var response = removeAnnoyingShit(xmlhttp.responseText);
                //console.log(xmlhttp.response);

            } else {
                console.log(xmlhttp.status);
            }
        };
        // post request to URL, async true.
        xmlhttp.open("POST", "php/matrixServer.php", true);
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.send(
            "w=" + width
            + "&h=" + height
            + "&n=" + N
            + "&matrix=" + encodeMatrix(matrixToSend)
            + "&sessionId=" + sessionId
            + "&name=" + getPlayerName());
    } catch (e) {
        console.log(e);
    }
}

function getMatrixFromServer(width, height, N) {
    try {

        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var response = removeAnnoyingShit(xmlhttp.responseText);
                    //console.log(xmlhttp.response);

                } else {
                    console.log("status " + xmlhttp.status);
                }
            }
        };

        // post request to URL, async because reasons.
        xmlhttp.open("POST", "php/matrixServer.php", true);
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var sendData = "getMatrix=please"
            + "&w=" + width
            + "&h=" + height
            + "&n=" + N;

        xmlhttp.send(sendData);

    } catch (e) {
        console.log(e);
    }
}

function getHighscoresFromServer() {
    // TODO: fix xmlhttp request too often
    // set timer
    //refreshHighscoreTimer = setTimeout(getHighscoresFromServer, refreshHighscoreDuration);

    try {

        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var response = removeAnnoyingShit(xmlhttp.responseText);
                    console.log("hs updated");
                    //console.log(response);
                    if (response.indexOf("excpt") >= 0) {
                        // exception
                        console.log("there was an exception");
                        //console.log(response);

                    } else if (response.indexOf("highscore is empty nigga") >= 0) {
                        console.log("highscores returned empty");
                        //console.log(response);

                    } else {
                        var json = JSON.parse(response);
                        //console.log(json);

                        // remove excess TRs of highscore-table
                        var highscoreTable = $("#highscore-table");
                        highscoreTable.find("tr").each(function (index, element) {
                            if ($(element).find("#highscore-title").length || $(element).find("th").length) {
                                // do nothing to the headers
                            } else {
                                $(element).remove();
                            }
                        });

                        // json is an array of assoc arrays of highscore data
                        // ordered from best to worst.
                        for (var i = 0; i < json.length; i++) {
                            var row = json[i];
                            // id
                            var w = row["width"];
                            var h = row["height"];
                            var name = row["name"];
                            var score = row["score"];

                            var tr = "<tr><td>" + name + "</td><td>" + w + "x" + h + "</td><td>" + score + "</td></tr>";
                            // append TRs to the highscore table. 
                            highscoreTable.find("tbody").append(tr);

                        }
                    }
                } else {
                    console.log("status " + xmlhttp.status);
                }
            }
        };

        // post request to URL, async because reasons.
        xmlhttp.open("POST", "php/getHighscores.php", true);
        //xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        //var sendData = "getHighscores=" + "ohyes";
        xmlhttp.send();

    } catch (e) {
        console.log(e);
    }
}

// saves session data for sessionId and returns true if found, else returns false.
function getSessionFromServer(sessionId) {
    try {

        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var response = removeAnnoyingShit(xmlhttp.responseText);
                    //console.log(xmlhttp.response);

                    if (response.indexOf("empty") >= 0) {
                        // result was empty. no such sessionId
                        console.log("result was empty. no such sessionID");
                        initTutorial();

                    } else if (response == "nothing was set") {
                        // nothing was set, or wrong sessionId
                        console.log("nothing was set, sessionId was empty");
                        initTutorial();

                    } else {
                        // json encoded array. check php for order of values
                        var json = JSON.parse(response);
                        var id = json[0]; // useless id
                        width = parseInt(json[1]);
                        height = parseInt(json[2]);
                        N = parseInt(json[3]);

                        matrix = decodeMatrix(json[4]);

                        // sessionId was already set
                        var sess = json[5];
                        // date of last play is not interesting, fuck it
                        var date = json[6];
                        // name should be reset so we can save again
                        var name = json[7];
                        setPlayerName(name);

                        // score is recalculated, fuck it
                        var score = json[8];
                        console.log("score is " + score);

                        // clicks and optimizeCells should be set so we continue the count
                        numClicks = parseInt(json[9]);
                        numOptimizeCells = parseInt(json[10]);

                        // tutorial cancel (player already been through this shit)
                        tutorial1Happened = true;
                        if (width >= tutorialLevels[1])
                            tutorial2Happened = true;
                        if (width >= tutorialLevels[2])
                            tutorial3Happened = true;


                        initRegular();

                    }
                } else {
                    console.log("status " + xmlhttp.status);
                    initTutorial();
                }
            } else {
                console.log("ready state of getSession request " + xmlhttp.readyState);
            }
        };

        // post request to URL, async because reasons.
        xmlhttp.open("POST", "php/getSession.php", true);
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var sendData = "sessionId=" + sessionId;
        xmlhttp.send(sendData);

    } catch (e) {
        console.log(e);
    }

}

function saveSessionToServer() {
    // if player name was set
    if (getPlayerName() != "YourNameHere") {
        // gather data: width, height, n, matrix, sessionId, date, name, score, clicks, optimizeCells
        try {
            var xmlhttp;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        var response = removeAnnoyingShit(xmlhttp.responseText);
                        //console.log(response);
                    } else {
                        console.log("status " + xmlhttp.status);
                    }
                }
            };

            // post request to URL, async because reasons.
            xmlhttp.open("POST", "php/saveSession.php", true);
            xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var data = "session=please";
            data += "&w=" + width
                + "&h=" + height
                + "&n=" + N;
            data += "&matrix=" + encodeMatrix(matrix);
            data += "&sessionId=" + sessionId;
            data += "&name=" + getPlayerName();
            data += "&score=" + totalMatrixScore;
            data += "&clicks=" + numClicks;
            data += "&optimizeCells=" + numOptimizeCells;
            xmlhttp.send(data);

        } catch (e) {
            console.log(e);
        }

    }
}


//////////////// cookies

function getSessionFromCookie() {
    if (getCookie("sessionId") != "") {
        console.log("Cookies get");
        
        // set all session data, much like getSessionFromServer() in saveload.js
        width = parseInt(getCookie("width"));
        height = parseInt(getCookie("height"));
        N = parseInt(getCookie("n"));
        matrix = decodeMatrix(getCookie("matrix"));
        setSessionId( getCookie("sessionId"));
        setPlayerName(getCookie("name"));
        numClicks = getCookie("clicks");
        numOptimizeCells = getCookie("optimizeCells");
        tutorial1Happened = true;
        if (width >= tutorialLevels[1])
            tutorial2Happened = true;
        if (width >= tutorialLevels[2])
            tutorial3Happened = true;
        return true;
    } else {
        console.log("no sessionId cookie. this guy never played before or deleted cookies.");
        return false;
    }

}

function saveSessionToCookie() {
    console.log("Cookies set");
    setCookie("sessionId", sessionId, 365);
    setCookie("width", width, 365);
    setCookie("height", height, 365);
    setCookie("n", N, 365);
    setCookie("matrix", encodeMatrix(matrix), 365);
    setCookie("name", getPlayerName(), 365);
    setCookie("clicks", numClicks, 365);
    setCookie("optimizeCells", numOptimizeCells, 365);

}

function resetAllCookies() {
    console.log("Cookies reset");
    setCookie("sessionId", "", -1);
    setCookie("width", "", -1);
    setCookie("height", "", -1);
    setCookie("n", "", -1);
    setCookie("matrix", "", -1);
    setCookie("name", "", -1);
    setCookie("clicks", "", -1);
    setCookie("optimizeCells", "", -1);

}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

