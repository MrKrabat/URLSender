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

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

import javafx.application.Application;
import javafx.application.Platform;
import javafx.scene.Scene;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;


/**
 * URLSender
 * Send URLs for playback directly on your Kodi device.
 *
 * @author MrKrabat
 * @version 1.0.0
 *
 */
public class URLSender extends Application {
	/** Stage handle */
	protected static Stage mainwindow = null;
	/** TextField handle */
	private static TextField displayAdress, displayURL;


	/**
	 * Launching JavaFX
	 *
	 * @param args command line arguments
	 */
	public static void main(String[] args) {
		launch();
	}


	/**
	 * JavaFX initialization
	 */
	@Override
	public void start(Stage stage) throws Exception {
		mainwindow = stage;
		stage.setTitle("URLSender");

		VBox rows = new VBox(10);
		rows.setStyle("-fx-padding: 15px;");

		Label labelAdress = new Label("Server Address:");
		displayAdress = new TextField("192.168.0.10:1337");

		Label labelURL = new Label("Video URL:");
		displayURL = new TextField();

		Button button = new Button("Send to Kodi");
		button.setOnAction(e -> send());

		rows.getChildren().addAll(labelAdress, displayAdress, labelURL, displayURL, button);

		stage.setScene(new Scene(rows));
		stage.show();
	}

	/**
	 * Send URL to Kodi
	 */
	private static void send() {
		// check if empty
		if(displayAdress.getText().isEmpty() || displayURL.getText().isEmpty()) {
			return;
		}

		String[] parts = displayAdress.getText().split(":");

		try {
			// connect to kodi
			Socket socket = new Socket(parts[0], Integer.parseInt(parts[1]));
			BufferedReader br = new BufferedReader(new InputStreamReader(socket.getInputStream()));
			PrintWriter out = new PrintWriter(socket.getOutputStream(), true);

			// send URL
			out.println(displayURL.getText());
			out.flush();

			// wait for answer
			int result = br.read();
			
			// Hint: ASCII char 49 == 1
			if(result == 49) { // OK
				PopupMsg(AlertType.INFORMATION, "URLSender", "Video playback started successfully.");
			} else if(result == 50) { // playlist
				PopupMsg(AlertType.INFORMATION, "URLSender", "Added the URL successfully to the playlist.");
			} else { // failed
				PopupMsg(AlertType.WARNING, "URLSender", "Kodi was not able to play the URL.");
			}

			// cleanup
			socket.close();
			br.close();
			out.close();
			displayURL.setText("");
		} catch (NumberFormatException | IOException e) {
			PopupMsg(AlertType.ERROR, "URLSender", "Could not send the URL to Kodi at '" + displayAdress.getText() + "'.");
			e.printStackTrace();
		}
	}

	/**
	 * creates and show a popup message
	 */
	public static void PopupMsg(AlertType vTyp, String sTitle, String sMessage) {
	    // run in javafx thread
		Platform.runLater(new Runnable() {
			@Override
			public void run() {
				// create alert
		    	Alert hAlert = new Alert(vTyp);
		    	//Stage hStage = (Stage) hAlert.getDialogPane().getScene().getWindow();

		    	// set values
		    	//hStage.getIcons().add(new Image("/resources/img/icon.png"));
		    	hAlert.setTitle(sTitle);
		    	hAlert.setHeaderText(null);
		    	hAlert.setContentText(sMessage);
		    	hAlert.initOwner(mainwindow);
		    	hAlert.show();
			}
		});
	}
}
