

function animateDwarf(dwarfDiv) {
    var animDuration = dwarfAnimDuration;
    var frameDuration = dwarfFrameDuration;

    clearTimeout(dwarfDiv.attr("t"));

    dwarfDiv.addClass("move");

    dwarfDiv.attr("t", setFrameRecursive(dwarfDiv, dwarfAnimStart, frameDuration, animDuration));

}
// for animate dwarf
function setFrameRecursive(dwarfDiv, frame, frameDuration, animDuration) {
    if (animDuration > 0) {
        return setTimeout(function () {
            if (frame < dwarfAnimStart) frame = dwarfAnimEnd;
            // set next frame
            dwarfDiv.css({
                'background-position-x': frame + 'px'
            });
            if (dwarfDiv.hasClass("move")) {
                dwarfDiv.attr("t", setFrameRecursive(dwarfDiv, frame - dwarfFrameWidth, frameDuration, animDuration - frameDuration));
            }
        }, frameDuration);
    } else {
        dwarfDiv.css({
            'background-position-x': 0 + 'px'
        });
        dwarfDiv.removeClass("move");
        return null;
    }
}