#NoTrayIcon
; #LICENSE# =======================================================================================================================
; URLSender - Send URLs for playback directly on your Kodi device.
; Copyright (C) 2016  MrKrabat
;
; This program is free software: you can redistribute it and/or modify
; it under the terms of the GNU Affero General Public License as
; published by the Free Software Foundation, either version 3 of the
; License, or (at your option) any later version.
;
; This program is distributed in the hope that it will be useful,
; but WITHOUT ANY WARRANTY; without even the implied warranty of
; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
; GNU Affero General Public License for more details.
;
; You should have received a copy of the GNU Affero General Public License
; along with this program.  If not, see <http://www.gnu.org/licenses/>.
; ===============================================================================================================================
#pragma compile(AutoItExecuteAllowed, false)
#pragma compile(UPX, false)
#pragma compile(inputboxres, false)
#pragma compile(ExecLevel, none)
#pragma compile(Icon, icon.ico)
#pragma compile(FileDescription, Send URLs for playback directly on your Kodi device.)
#pragma compile(ProductName, URLSender)
#pragma compile(ProductVersion, 1.0.0.0)
#pragma compile(FileVersion, 1.0.0.0)
#pragma compile(LegalCopyright, Copyright (C) 2016  MrKrabat)
#pragma compile(LegalTrademarks, GNU Affero General Public License 3 - AGPLv3)
#pragma compile(CompanyName, MrKrabat)


Opt("GUIOnEventMode", 1)
Opt("GUIResizeMode", 0x0001)
AutoItWinSetTitle("URLSender")
OnAutoItExitRegister("_exit_global")
TCPStartup()

; create gui
$hGUI_Main = GUICreate("URLSender", 370, 85)
GUISetOnEvent(-3, "_exit", $hGUI_Main)

GUICtrlCreateLabel("Address:", 5, 5, 40, 20)
$hAddress = GUICtrlCreateInput("192.168.0.10:1337", 60, 5, 300, 20)

GUICtrlCreateLabel("URL:", 5, 30, 40, 20)
$hURL = GUICtrlCreateInput("", 60, 30, 300, 20)

GUICtrlCreateButton("Send to Kodi", 60, 55, 100, 20)
GUICtrlSetOnEvent(-1, "_send")

GUISetState(@SW_SHOW, $hGUI_Main)


; main loop
While Sleep(250)
	; nothing
WEnd


; send function
Func _send()
	$address = StringSplit(GUICtrlRead($hAddress), ":", 1)

	; connect
	$hCon = TCPConnect($address[1], $address[2])
	If @error Then
		MsgBox(48, "URLSender", "Connection to Kodi at '" & GUICtrlRead($hAddress) & "' failed.", 0, $hGUI_Main)
		Return -1
	EndIf

	; send URL
	TCPSend($hCon, GUICtrlRead($hURL))
	If @error Then
		MsgBox(48, "URLSender", "Failed to send the URL '" & GUICtrlRead($hURL) & "' to Kodi.", 0, $hGUI_Main)
		Return -1
	EndIf

	; receive reply
	$data = TCPRecv($hCon, 1024)
	If @error Then
		MsgBox(48, "URLSender", "Failed to receive an answer from Kodi.", 0, $hGUI_Main)
		Return -1
	EndIf

	; check result
	If $data == "1" Then
		MsgBox(64, "URLSender", "Video playback started successfully.", 0, $hGUI_Main)
	ElseIf $data == "2" Then
		MsgBox(64, "URLSender", "Added the URL successfully to the playlist.", 0, $hGUI_Main)
	Else
		MsgBox(48, "URLSender", "Kodi was not able to play the URL.", 0, $hGUI_Main)
	EndIf

	; cleanup
	GUICtrlSetData($hURL, "")
	TCPCloseSocket($hCon)
EndFunc   ;==>_send

Func _exit()
	GUIDelete(@GUI_WinHandle)
	Exit
EndFunc   ;==>_exit

Func _exit_global()
	TCPShutdown()
EndFunc   ;==>_exit_global
