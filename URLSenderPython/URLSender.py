# -*- coding: utf-8 -*-
# URLSender - Send URLs for playback directly on your Kodi device.
# Copyright (C) 2016  MrKrabat
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#

# imports
import socket
import argparse


if __name__ == '__main__':
    # check command line arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("-u", "--url", help="Video or music URL.", required=True)
    parser.add_argument("-d", "--host", help="IP-Address of your Kodi device.", required=True)
    parser.add_argument("-p", "--port", default="1337", help="Port URLReceiver is listening on. Default: 1337.")
    args = parser.parse_args()

    try:
        # connect to server
        s = socket.socket()
        s.connect((args.host, int(args.port)))

        # send data
        s.sendall(args.url)

        # receive answer
        data = s.recv(1024).rstrip()

        if "1" in data:
            print "Video playback started successfully.\n"
        elif "2" in data:
            print "Added the URL successfully to the playlist.\n"
        else:
            print "Kodi was not able to play the URL.\n"

    except socket.error:
        print "Connection to Kodi at '%s:%s' failed.\n" % (args.host, args.port)

    finally:
        # cleanup
        s.close()
