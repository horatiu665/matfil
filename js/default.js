$(function () {
    "use strict";

    console.log("app started");


    // hide all power icons
    $(".powerIcon").hide();

    // disable right click
    $(".noselect").on("contextmenu", function (event) {
        event.preventDefault();
    });

    // event for entering name for highscores
    var playerNameDiv = $("#playerNameDiv");
    playerNameDiv.on("click", function () {
        // if span, replace with input, and when enter, replace with span with new name
        if (playerNameDiv.find("#nameSpan").length) {
            playerName = playerNameDiv.find("span").html();

            // replace with input
            var formEl = $('<form class="nameForm"><input id="playerNameInput" type="text" value="' + playerName + '">' +
                '<input type="submit" style="color:#777" value="Save"></input>'
                + '</input></form>');
            playerNameDiv.html(formEl);
            var inputEl = playerNameDiv.find("#playerNameInput");
            inputEl.trigger("focus");
            inputEl.focus();
            var tmpStr = inputEl.val();
            inputEl.val('');
            inputEl.val(tmpStr);

            var saveShit = function (event) {
                // submitted
                var inputName = playerNameDiv.find("input").val();
                setPlayerName(inputName);

            }; // on blur, save name
            inputEl.on("blur", saveShit);
            playerNameDiv.find("form").on("submit", function (event) {
                saveShit();
                event.preventDefault();
            });

        }
    });


    // from http://stackoverflow.com/questions/985272/selecting-text-in-an-element-akin-to-highlighting-with-your-mouse
    function SelectText(element) {
        var doc = document
            , text = doc.getElementById(element)
            , range, selection
        ;
        if (doc.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
        } else if (window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    loadScript("js/config.js", function () {
        loadScript("js/utils.js", function () {
            loadScript("js/nextLevel.js", function () {
                loadScript("js/advancedOperations.js", function () {
                    loadScript("js/matrixOperations.js", function () {
                        loadScript("js/graphicalStuff.js", function () {
                            loadScript("js/logger.js", function () {
                                loadScript("js/saveload.js", function () {
                                    // get highscores table. can be async operation, does not interfere
                                    getHighscoresFromServer();

                                    loadScript("js/start.js", function () {

                                        // if URL set to session, get it from server.
                                        // else, get it from cookie.

                                        var sessionIdUrl = getUrlParameter("sessionId");
                                        if (sessionIdUrl != null) {
                                            console.log("session from server");
                                            setSessionId( sessionIdUrl);
                                            // set session id and query server for the data. if does not exist, set to random.
                                            getSessionFromServer(sessionIdUrl);
                                            // set Loading... instead of matrix
                                            var loadingDiv = $("<div>");
                                            $("#matrixDiv tbody").html(loadingDiv);
                                            loadingDiv.addClass("loadingDiv center");
                                            loadingDiv.html("Loading game...");
                                            loadingDiv.css({
                                                'width': getPixelBodyWidth() * width,
                                                'height': getPixelBodyWidth() * height
                                            });
                                            resizeGrid();
                                        } else {
                                            // get session from cookie. if not found, init tutorial.
                                            if (getCookie("sessionId") != "") {
                                                console.log("session from cookie");
                                                getSessionFromCookie();
                                                initRegular();
                                            } else {
                                                console.log("session tutorial");
                                                initTutorial();
                                            }
                                        }

                                        // do not start game manually. rely on getSessionFromServer to start it.
                                        // there is a "Loading..." text anyway.
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });



    // from http://stackoverflow.com/questions/19491336/get-url-parameter-jquery
    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }

    // the function below causes a refresh of the page. so it is not very useful.
    // from http://stackoverflow.com/questions/1090948/change-url-parameters
    function updateURLParameter(url, param, paramVal) {
        var TheAnchor = null;
        var newAdditionalURL = "";
        var tempArray = url.split("?");
        var baseURL = tempArray[0];
        var additionalURL = tempArray[1];
        var temp = "";

        if (additionalURL) {
            var tmpAnchor = additionalURL.split("#");
            var TheParams = tmpAnchor[0];
            TheAnchor = tmpAnchor[1];
            if (TheAnchor)
                additionalURL = TheParams;

            tempArray = additionalURL.split("&");

            for (var i = 0; i < tempArray.length; i++) {
                if (tempArray[i].split('=')[0] != param) {
                    newAdditionalURL += temp + tempArray[i];
                    temp = "&";
                }
            }
        }
        else {
            var tmpAnchor = baseURL.split("#");
            var TheParams = tmpAnchor[0];
            TheAnchor = tmpAnchor[1];

            if (TheParams)
                baseURL = TheParams;
        }

        if (TheAnchor)
            paramVal += "#" + TheAnchor;

        var rows_txt = temp + "" + param + "=" + paramVal;
        return baseURL + "?" + newAdditionalURL + rows_txt;
    }

    // omnipresent scriptloader
    function loadScript(url, callback) { var a = document.createElement('script'); a.src = url; a.onreadystatechange = callback; a.onload = callback; $('head')[0].appendChild(a); }

    // for loading scripts. ugly version with links and comments
    //// http://stackoverflow.com/questions/950087/include-a-javascript-file-in-another-javascript-file
    //// loading a script dynamically the safe way without bullshit plugins
    //function loadScript(url, callback) {
    //    // Adding the script tag to the head as suggested before
    //    var head = document.getElementsByTagName('head')[0];
    //    var script = document.createElement('script');
    //    script.type = 'text/javascript';
    //    script.src = url;

    //    // Then bind the event to the callback function.
    //    // There are several events for cross browser compatibility.
    //    script.onreadystatechange = callback;
    //    script.onload = callback;

    //    // Fire the loading
    //    head.appendChild(script);
    //}

});
