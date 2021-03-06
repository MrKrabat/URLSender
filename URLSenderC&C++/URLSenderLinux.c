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

#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <arpa/inet.h>


/**
	URLSender
	Send URLs for playback directly on your Kodi device.
*/
int main(int argc, char *argv[]) {
	// check command line arguments
	if(argc != 4) {
		printf("Usage: URLSender <IP> <Port> <URL>\nExample: ./URLSender 192.168.0.10 1337 'http://localhost/movie.mp4'\n");
		return 0;
	}
	int port;
	sscanf(argv[2], "%d", &port);

	// define vars
	int socket_desc;
	struct sockaddr_in server;
	char server_reply[2048];
	int recv_size;

	// create socket
	socket_desc = socket(AF_INET, SOCK_STREAM, 0);
	if(socket_desc == -1) {
		printf("Could not create socket.\n");
		return 1;
	}

	// settings
	server.sin_addr.s_addr = inet_addr(argv[1]);
	server.sin_family = AF_INET;
	server.sin_port = htons(port);

	// connect
	if(connect(socket_desc, (struct sockaddr *)&server, sizeof(server)) < 0) {
		printf("Connection to Kodi at '%s:%d' failed.\n", argv[1], port);
		return 1;
	}

	// send URL
	if(send(socket_desc, argv[3], strlen(argv[3]), 0) < 0) {
		printf("Failed to send the URL '%s' to Kodi.\n", argv[3]);
		return 1;
	}

	// receive reply
	if((recv_size = recv(socket_desc, server_reply, 2048, 0)) < 0) {
		printf("Failed to receive an answer from Kodi.\n");
		return 1;
	}

	// check result
	server_reply[recv_size] = '\0';
	if((int)server_reply[0] == 49) {
		printf("Video playback started successfully.\n");
	} else if((int)server_reply[0] == 50) {
		printf("Added the URL successfully to the playlist.\n");
	} else {
		printf("Kodi was not able to play the URL.\n");
	}

	// cleanup
	close(socket_desc);
	return 0;
}
