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

// saves options to chrome.storage
function saveOptions() {
    var address = document.getElementById("address").value;
    chrome.storage.sync.set({
        kodiAddress: address,
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById("status");
        status.textContent = "Options saved.";
        setTimeout(function() {
            status.textContent = "";
        }, 750);
    });
}

// restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        kodiAddress: "192.168.0.10:1337",
    }, function(items) {
        document.getElementById("address").value = items.kodiAddress;
    });
}

// set listener
document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
