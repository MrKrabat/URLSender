/*
 * URLSender - Send URLs for playback directly on your Kodi device.
 * Copyright (C) 2016  MrKrabat
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// handle click
function sendtokodi() {
    var wStream = $(".wStream iframe").attr("src");
    if(typeof wStream == "undefined") {
        wStream = $(".wStream a").attr("href");
    }

    // proxer stream handling
    if(wStream.toLowerCase().indexOf("stream.proxer.me") >= 0) {
        wStream = $("#kodihidden").html();
    } else if(wStream.toLowerCase().indexOf("crunchyroll.com") >= 0) {
        // Crunchyroll stream handling
        wStream = $(".wStream .external_player").attr("href");
    }

    // failed
    if(typeof wStream == "undefined") {
        alert("Error: " + wStream);
        return;
    }

    // send to kodi
    chrome.storage.sync.get({
        kodi_address: "192.168.0.10:1337",
    }, function(items) {
        window.open("http://" + items.kodi_address + "/urlsend=" + wStream, "_blank");
    });
}

$(document).ready(function() {
    // Proxerstream Handling
    var isTop = true;
    chrome.runtime.onMessage.addListener(function(details) {
        $("#kodihidden").text(details);
    });

    // get button area
    var buttonarea = $("table#wContainer tr.no_details").children("td").eq(1);

    // add button
    var $input = $('<a href="javascript:void(0);" id="watchonkodi" class="menu reminder" title="Watch on Kodi">Watch on Kodi</a><div style="width: 0px; height: 0px; visibility: hidden;" id="kodihidden"></span>').click(sendtokodi);
    buttonarea.children("br").remove();
    buttonarea.append($input);
});
