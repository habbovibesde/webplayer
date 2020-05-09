/**
 * HabboVibes.de - Webplayer
 * 
 * @author   Gummiauge & efi.styler
 * @version  1.0.0
 */

$(function() {
    "use strict";

    console.log("%cHabboVibes.de Webplayer", "color: #F56712; font-weight: bold");

    // Audio-Element erstellen
    var stream = document.createElement("audio");
    stream.src = "https://stream.habbovibes.de/;";
    stream.volume = getCookie("wp_volume") ? getCookie("wp_volume") : 1;
    stream.play();

    // Volume Slider initialisieren
    $("#slider").slider({
        value: getCookie("wp_volume") ? getCookie("wp_volume") * 100 : 100,
        slide: function(event, ui) {
            stream.volume = ui.value / 100;
            setCookie("wp_volume", stream.volume, 7);
        }
    });

    // Events zu den Buttons hinzufügen
    $("#playButton").on("click", () => {
        stream.src = stream.src; // Source neu setzen, damit es live bleibt
        stream.play();
    });
    $("#pauseButton").on("click", () => stream.pause());

    // Radiostatus von API laden
    addInterval(() => {
        $.getJSON("api.json", function (response) {
            var song = response.songtitle.split(" - ");

            $("#programm").html(`
                <div class="title">${marquee(response.programm, 45)}</div>
                <div class="subtitle">mit DJ ${response.deejay}</div>
                <div class="title">${song[0] ? marquee(song[0], 40) : ''}</div>
                <div class="subtitle">${song[1] ? marquee(song[1], 52) : ''}</div>
                <div id="listeners">${response.listeners == 1 ? '1 Habbo h&ouml;rt gerade zu' : response.listeners + ' Habbos h&ouml;ren gerade zu'}</div>
            `);
            $("#habbo").css("background-image", `url('https://www.habbo.de/habbo-imaging/avatarimage?user=${response.deejay}&gesture=sml&direction=4&head_direction=3')`);
        });
    }, 30 * 1000);
});

/**
 * Interval setzen und Callback sofort ausführen
 * @param {Function} callback 
 * @param {int} timeout 
 */
function addInterval(callback, timeout) {
    callback(); // Run for first time
    setInterval(callback, timeout);
}

/**
 * Prüfen, ob Text lang genug ist für Marquee
 * @param {string} data 
 * @param {int} length 
 */
function marquee(data, length) {
    if (data.length >= length) {
        return `<marquee behavior="alternate" scrollamount="3" onmouseover="this.stop();" onmouseout="this.start();">${data}</marquee>`;
    }

    return data;
}

/**
 * Get cookie
 * @param {string} name 
 */
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

/**
 * Set cookie
 * @param {string} name 
 * @param {string} value 
 * @param {int} days 
 */
function setCookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    var expires = "; expires=" + date.toGMTString();
    document.cookie = name + "=" + value + expires + "; path=/";
}