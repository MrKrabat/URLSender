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

chrome.runtime.onMessage.addListener(function(message, sender) {
    if (message.sendBack) {
        chrome.tabs.sendMessage(sender.tab.id, message.data);
    }
});
