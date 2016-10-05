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

// handle click
function sendtokodi() {
	var wStream = $(".wStream iframe").attr("src");
	if(typeof wStream == "undefined") {
		var wStream = $(".wStream a").attr("href");
	}
	
	// proxer stream handling
	if(wStream.toLowerCase().indexOf("stream.proxer.me") >= 0) {
		wStream = $("#kodihidden").html();
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
		$.get("http://" + items.kodi_address + "/urlsend=" + wStream, function( my_var ) {
			if(my_var == "1") {
				alert("Video playback started successfully.");
			} else if(my_var == "2") {
				alert("Added the URL successfully to the playlist.");
			} else {
				alert("Kodi was not able to play the URL.");
			}
		}, "html");
	});
}