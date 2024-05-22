/****************************************
musicObject code 2.1.6
written by C. van Rensburg					  

© Copyright 1996,1997 Headspace, Inc.
All  Rights Reserved
***************************************/

//*** constant definitions

cControl = 1;
cPlugin = 2;

//*** global properties & functions

function musicObjectDebug (errorMessage,errorURL,errorLineNo) {
	java.lang.System.out.println ('\n**** JAVASCRIPT ERROR ****\nTYPE: ' + errorMessage + '\nLINE# ' + errorLineNo + '\nFILE: ' + errorURL);
	window.defaultStatus = '**** JAVASCRIPT ERROR **** TYPE: ' + errorMessage + ' --- LINE# ' + errorLineNo + ' --- FILE: ' + errorURL;
	return true;
}

window.onerror = musicObjectDebug;
top.onerror = musicObjectDebug;

with (navigator) {
	if ((userAgent.indexOf ('Mozilla/3.') != -1 || userAgent.indexOf ('Mozilla/4.') != -1 || userAgent.indexOf ('Mozilla/5.') != -1) && userAgent.indexOf ('compatible') == -1) {
		BeatnikType = cPlugin;
	} else if (userAgent.indexOf ('MSIE 3.') != -1 || userAgent.indexOf ('MSIE 4.') != -1 || userAgent.indexOf ('MSIE 5.') != -1) {
		BeatnikType = cControl;
	} else {
		BeatnikType = 0;
	}
}

isJavaScript1_1 = (navigator.userAgent.indexOf ('Mozilla/3.0') != -1) || (navigator.userAgent.indexOf ('Mozilla/4.0') != -1 || navigator.userAgent.indexOf ('MSIE 4.') != -1);

function requireJavaScript1_1 (frameHandle) {
	if (frameHandle == null) {frameHandle = window}
	if (isJavaScript1_1) {
		return true;
	} else {
		with (frameHandle.document) {
			writeln ('<CENTER><BR><BR>');
			writeln ('<TABLE WIDTH=95% BORDER=0 CELLSPACING=0 CELLPADDING=1 BGCOLOR=666666><TR><TD>');
			writeln ('<TABLE WIDTH=100% BORDER=0 CELLSPACING=0 CELLPADDING=8 BGCOLOR=DDDDDD><TR><TD><FONT FACE="Arial,Helvetica,Verdana" COLOR=000000><FONT SIZE=+2>This page has been optimized for JavaScript 1.1 features only supported in <FONT COLOR=FF0000>Netscape Navigator 3.0x or higher</FONT>, and Microsoft <FONT COLOR=FF0000>Internet Explorer 4.0x or higher</FONT>.<P>It can <U>not</U> be shown on Navigator 2.0x or earlier, or Internet Explorer 3.0x or earlier.</FONT><P><CENTER><FONT SIZE=+1>Get the latest version<BR>|<BR></FONT><TABLE BORDER=0 CELLSPACING=0 CELLPADDING=5><TR><TD><FORM METHOD=GET ACTION="http://www.netscape.com" TARGET="_top"><INPUT TYPE=submit VALUE="NETSCAPE NAVIGATOR"></FORM></TD><FORM METHOD=GET ACTION="http://www.microsoft.com" TARGET="_top"><INPUT TYPE=submit VALUE="INTERNET EXPLORER"></FORM><TD></TD></TR></TABLE></FONT></CENTER></TD></TR></TABLE>');
			writeln ('</TD></TR></TABLE>');
			writeln ('</CENTER><BR>');
			return false;
		}
	}
}

attrNames = new Array ('SRC','TYPE','WIDTH','HEIGHT','NAME','AUTOSTART','LOOP','VOLUME','ALIGN','HSPACE','VSPACE','PLUGINSPAGE','HIDDEN','DISPLAY','MODE','GROOVOID','ONREADY','ONPLAY','ONPAUSE','ONSTOP','ONMETAEVENT');

attributes = new Array ();

noteNumbers = new Array ();

noteNumbers ['c'] = 0;
noteNumbers ['d'] = 2;
noteNumbers ['e'] = 4;
noteNumbers ['f'] = 5;
noteNumbers ['g'] = 7;
noteNumbers ['a'] = 9;
noteNumbers ['b'] = 11;
	
noteNames = new Array ("C","C#","D","D#","E","F","F#","G","G#","A","A#","B");

hasBeatnik = true;
ignoreBeatnik = false;

with (navigator) {
	if ((userAgent.indexOf ('Mozilla/3.') != -1 || userAgent.indexOf ('Mozilla/4.') != -1) && userAgent.indexOf ('compatible') == -1) {
		hasBeatnik = false;
		for (pluginNo = 1; pluginNo <= plugins.length && !hasBeatnik; pluginNo++) {
			if (plugins [pluginNo - 1].name.indexOf ('Beatnik') != -1) {
				hasBeatnik = true;
			}
		}
	}
}

function alertWindowIgnore () {
	alertWindow.close ();
	this.focus ();
}

function alertWindowDownload () {
	alertWindow.close ();
	top.location.href = 'http://www.headspace.com/beatnik/?plug-in';
}

//*** global functions

//*** random ()

function random (range) {
	return Math.round (Math.random () * (range - 1)) + 1;
}

//*** randomPP object class

function randomPP_selectNext () {
	var flagsFound = 0;
	var randomFlag = random (this.flagsRemaining);
	for (var flagNo = 1; flagNo <= this.totalFlags; flagNo++) {
		if (!this.flags [flagNo]) {
			flagsFound++;
			if (flagsFound == randomFlag) {
				randomFlag = flagNo;
				this.flags [randomFlag] = true;
				break;
			}
		}
	}
	this.flagsSelected++;
	this.flagsRemaining--;
	if (this.flagsSelected == this.totalFlags) {
		this.flagsSelected = 0;
		this.flagsRemaining = this.totalFlags;
		for (var flagNo = 1; flagNo <= this.totalFlags; flagNo++) {
			this.flags [flagNo] = false;
		}
	}
	return randomFlag;
}

function randomPP (range) {
	this.flags = new Array (range)
	this.totalFlags = range;
	this.flagsSelected = 0;
	this.flagsRemaining = this.totalFlags;
	this.selectNext = randomPP_selectNext;
	for (var flagNo = 1; flagNo <= this.totalFlags; flagNo++) {
		this.flags [flagNo] = false;
	}
}

//*** randomFromList ()

function randomFromList (prefix,suffix) {
	var totalItems = randomFromList.arguments.length - 2;
	if (totalItems == 0) {
		return prefix + suffix;
	} else {
		var randomItemNo = random (totalItems);
		return prefix + randomFromList.arguments [randomItemNo + 1] + suffix;
	}
}

//*** noteObject class definition

function noteObject (bankNo,programNo,noteNo,velocity,duration) {
	this.bankNo = bankNo;
	this.programNo = programNo;
	this.noteNo = noteNo;
	this.velocity = velocity;
	this.duration = duration;
}

//*** musicObject class definition

function pathFromTop () {
	var resultStr = '';
	windowHandle = window;
	while (windowHandle.parent != windowHandle && windowHandle.parent != null) {
		for (frameNo = 1; frameNo <= windowHandle.parent.frames.length; frameNo++) {
			if (windowHandle == windowHandle.parent.frames [frameNo - 1]) {
				resultStr = 'frames[' + (frameNo - 1) + '].' + resultStr;
			}
		}
		windowHandle = windowHandle.parent;
	}
	resultStr = 'top.' + resultStr;
	return resultStr;
}

function mo_magicEmbed (embedLine) {
	if (hasBeatnik) {
		with (this) {
			//*** parse EMBED line attributes

			for (attrNo = 1; attrNo <= attrNames.length; attrNo++) {
				attributes [attrNames [attrNo - 1]] = null;
			}

			attributes ['SRC'] = 'stub.rmf';
			attributes ['TYPE'] = '';

			callbackPrefix = objectName + '.';
			if (BeatnikType == cPlugin) {callbackPrefix = pathFromTop () + callbackPrefix}

			attributes ['ONREADY'] = callbackPrefix + 'setReady ()';
			attributes ['ONPLAY'] = callbackPrefix + 'execOnPlay ()';
			attributes ['ONPAUSE'] = callbackPrefix + 'execOnPause ()';
			attributes ['ONSTOP'] = callbackPrefix + 'execOnStop ()';
			attributes ['ONMETAEVENT'] = callbackPrefix + 'execOnMetaEvent ()';

			attributes ['WIDTH'] = '144';
			attributes ['HEIGHT'] = '60';
			attributes ['NAME'] = this.instanceName;
			attributes ['PLUGINSPAGE'] = 'http://www.headspace.com/beatnik/?plug-in';

			tagEndFound = false;
			tagStartPos = 0;
			spacePos = embedLine.indexOf (' ',tagStartPos);
			if (spacePos == -1) {spacePos = embedLine.length}
			closePos = embedLine.indexOf ('>',tagStartPos);
			if (closePos == -1) {closePos = embedLine.length}
			tagNameEndPos = spacePos;
			if (closePos < tagNameEndPos) {
				tagNameEndPos = closePos;
				tagEndFound = true;
			}
			tagName = embedLine.substring (tagStartPos + 1,tagNameEndPos);
			tagName = tagName.toUpperCase ();
			
			if (tagName == 'EMBED') {
				attrStartPos = tagNameEndPos;
				while (!tagEndFound) {
					attrFound = false;
					while (!tagEndFound && !attrFound) {
						subChar = embedLine.substring (attrStartPos,attrStartPos + 1);
						if (subChar != ' ') {
							if (subChar == '>') {
								tagEndFound = true;
							} else {
								attrFound = true;
							}
						} else {
							attrStartPos++;
						}
					}
					if (attrFound) {
						equalPos = embedLine.indexOf ('=',attrStartPos);
						if (equalPos == -1) {equalPos = embedLine.length}
						spacePos = embedLine.indexOf (' ',attrStartPos);
						if (spacePos == -1) {spacePos = embedLine.length}
						closePos = embedLine.indexOf ('>',attrStartPos);
						if (closePos == -1) {closePos = embedLine.length}

						hasValue = true;
						attrNameEndPos = equalPos;
						if (spacePos < attrNameEndPos) {
							attrNameEndPos = spacePos;
							hasValue = false;
						}
						if (closePos < attrNameEndPos) {
							attrNameEndPos = closePos;
							hasValue = false;
							tagEndFound = true;
						}
						attrName = embedLine.substring (attrStartPos,attrNameEndPos);
						attrName = attrName.toUpperCase ();
						attrValuePos = attrNameEndPos + 1;
						attrValue = '';

						if (hasValue) {
							charCount = 0;
							attrValueEndFound = false;
							quoteChar = '';
							inEscape = false;
							while (!attrValueEndFound && !tagEndFound) {
								subChar = embedLine.substring (attrValuePos,attrValuePos + 1);
								if (subChar == '"' || subChar == "'") {
									if (charCount == 0) {
										quoteChar = subChar;
										subChar = '';
									} else if (subChar == quoteChar && !inEscape) {
										attrValueEndFound = true;
										subChar = '';
									}
								} else if (subChar == ' ') {
									if (quoteChar == '') {
										attrValueEndFound = true;
										subChar = '';
									}
								} else if (subChar == '>') {
									if (quoteChar == '') {
										attrValueEndFound = true;
										tagEndFound = true;
										subChar = '';
									}
								} else if (subChar == '\\') {
									if (!inEscape) {
										inEscape = true;
										subChar = '';
									} else {
										inEscape = false;
									}
								}
								if (subChar != '\\') {
									inEscape = false;
								}
								attrValue += subChar;
								attrValuePos++;
								charCount++;
							}
						}
						attrStartPos = attrValuePos;
						attributes [attrName] = attrValue;
						if (attrName == 'SRC') {
							if (attributes ['TYPE'] == '') {attributes ['TYPE'] = 'audio/rmf'}
						}
					}
				}
			}

			if (attributes ['TYPE'] == '') {attributes ['TYPE'] = 'audio/rmf'}
			if (attributes ['HIDDEN'] != null) {if (attributes ['HIDDEN'] == '') {attributes ['HIDDEN'] = 'TRUE'}}
			if (attributes ['NAME'] == '') {attributes ['NAME'] = this.instanceName}
			this.instanceName = attributes ['NAME'];

			with (document) {
				if (BeatnikType == cPlugin) {
					newEmbedLine = '<EMBED';
					for (attrNo = 1; attrNo <= attrNames.length; attrNo++) {
						if (attributes [attrNames [attrNo - 1]] != null) {
							newEmbedLine += ' ' + attrNames [attrNo - 1];
							if (attributes [attrNames [attrNo - 1]] != '') {
								newEmbedLine += '="' + attributes [attrNames [attrNo - 1]] + '"';
							}
						}
					}
					newEmbedLine += '>';
					document.writeln (newEmbedLine);
				} else if (BeatnikType == cControl) {
					var callbacks = new Array ('OnReady','OnPlay','OnPause','OnStop','OnMetaEvent');
					for (var callbackNo = 1; callbackNo <= callbacks.length; callbackNo++) {
						writeln ('<SCRIPT LANGUAGE=JavaScript FOR="' + instanceName + '" EVENT="' + callbacks [callbackNo - 1] + ' ()">');
						writeln (attributes [callbacks [callbackNo - 1].toUpperCase ()]);
						writeln ('</SCRIPT>');
					}
					writeln ('<OBJECT ID="' + instanceName + '" WIDTH=' + attributes ['WIDTH'] + ' HEIGHT=' + attributes ['HEIGHT'] + ' CLASSID="CLSID:B384F118-18EE-11D1-95C8-00A024330339" CODEBASE="http://download.headspace.com/beatnik-activex/beatnik.cab">');
					for (attrNo = 1; attrNo <= attrNames.length; attrNo++) {
						if (attributes [attrNames [attrNo - 1]] != null) {
							writeln ('<PARAM NAME="' + attrNames [attrNo - 1] + '" VALUE="' + attributes [attrNames [attrNo - 1]] + '">');
						}
					}
					writeln ('</OBJECT>');
				} else {
					writeln ('<A HREF="http://www.headspace.com/beatnik/?plug-in" TARGET="_top"><IMG SRC="http://www.headspace.com/beatnik/images/get-beatnik-plugin.gif" WIDTH=144 HEIGHT=60 BORDER=0 ALT="Get the Beatnik Plug-in NOW!"></A>');
				}
			}
		}
	} else if (!ignoreBeatnik) {
		ignoreBeatnik = true;
		alertWindow = window.open ('','alertWindow','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=300');
		with (alertWindow.document) {
			open ('text/html');
			writeln ('<HTML><HEAD><TITLE>Beatnik Enhanced Content !!</TITLE></HEAD>');
			writeln ('<BODY BGCOLOR=999999 TEXT=CCCCCC LINK=FFFFFF VLINK=FFFFFF ONBLUR="this.focus ()">');
			writeln ('<FORM>');
			writeln ('<TABLE WIDTH=100% HEIGHT=100% BORDER=0 CELLSPACING=10 CELLPADDING=6 BGCOLOR=000000>');
			writeln ('<TR><TD ALIGN=CENTER BGCOLOR=FFFFFF><FONT FACE="ARIAL,HELVETICA,VERDANA" COLOR=000000 SIZE=+2>Beatnik Enhanced Content !!</FONT></U><BR>');
			writeln ('<TR><TD VALIGN=TOP>');
			writeln ('<FONT FACE="ARIAL,HELVETICA,VERDANA">');
			writeln ('This page has been optimized for the interactive audio features of the <FONT COLOR=FFFFFF><B>Beatnik Plug-in</B></FONT>. It appears you do not have the Beatnik Plug-in installed.');
			writeln ('<P>');
			writeln ('If you choose to IGNORE this message, the page will continue to load normally, except there will be no Beatnik audio.');
			writeln ('<P>');
			writeln ('</FONT>');
			writeln ('<TABLE WIDTH=100% BORDER=0 CELLSPACING=0 CELLPADDING=0><TR>');
			writeln ('<TD ALIGN=LEFT><INPUT TYPE=button VALUE="IGNORE" ONCLICK="window.opener.alertWindowIgnore ()"></TD>');
			writeln ('<TD ALIGN=RIGHT><INPUT TYPE=button VALUE="DOWNLOAD >>>" ONCLICK="window.opener.alertWindowDownload ()"></TD>');
			writeln ('</TR></TABLE>');
			writeln ('</TD></TR></TABLE>');
			writeln ('</FORM>');
			writeln ('</BODY></HTML>');
			close ();
		}
	}
}

function mo_stubEmbed (stubURL) {
	this.magicEmbed ('<EMBED' + ((stubURL == null) ? '' : (' SRC="' + stubURL + '"')) + ' WIDTH=2 HEIGHT=2 HIDDEN AUTOSTART=TRUE LOOP=TRUE>');
}

function mo_preloadEmbed (fileURL,extraAttr) {
	if (extraAttr == null) {extraAttr = ''}
	this.magicEmbed ('<EMBED SRC="' + fileURL + '" WIDTH=2 HEIGHT=2 HIDDEN AUTOSTART=FALSE LOOP=TRUE VOLUME=100 ' + extraAttr + '>');
}

function mo_play (p1,p2) {
	with (this) {
		if (ready) {
			clearTimeout (fadeTimeout);
			if ((typeof (p1) == "boolean" || typeof (p1) == "number") && typeof (p2) == "string") {
				instanceID.play (p1,p2);
			} else if (typeof (p1) == "string" || typeof (p1) == "boolean" || typeof (p1) == "number") {
				instanceID.play (p1);
			} else {
				instanceID.play ();
			}
		}
	}
}

function mo_playGroovoid (p1,p2) {
	this.play (p1,"groovoid://" + p2);
}

function mo_stop (fade) {
	with (this) {
		if (ready) {
			clearTimeout (fadeTimeout);
			if (typeof (fade) != "boolean") {
				instanceID.stop ();
			} else {
				if (fade) {
					if (isPaused ()) {
						stop ();
					}
				}
				instanceID.stop (fade);
			}
		}
	}
}

function mo_pauseAtZero () {
	with (this) {
		if (ready) {
			if (getVolume () == 0) {
				pause ();
				clearTimeout (fadeTimeout);
			} else {
				pauseTimeout = setTimeout (objectName + '.pauseAtZero ()',500);
			}
		}
	}
}

function mo_pause (fade) {
	with (this) {
		if (ready) {
			if (typeof (fade) != "boolean") {
				clearTimeout (fadeTimeout);
				instanceID.pause ();
			} else if (fade) {
				fadeFromTo (getVolume (),0);
				pauseAtZero ();
			} else {
				clearTimeout (fadeTimeout);
				instanceID.pause ();
			}
		}
	}
}

function mo_setLoop (state) {
	if (this.ready) {this.instanceID.setLoop (state)}
}

function mo_setAutostart (state) {
	if (this.ready) {this.instanceID.setAutostart (state)}
}

function mo_fadeTo (toValue) {
	if (this.ready) {this.instanceID.fade_to (toValue)}
}

function mo_fadeFromTo (fromValue,toValue) {
	if (this.ready) {this.instanceID.fade_from_to (fromValue,toValue)}
}

function mo_setReady (initFunctionStr) {
	with (this) {
		if (window [instanceName] != null) {
			instanceID = window [instanceName];
		} else if (document [instanceName] != null) {
			instanceID = document [instanceName];
		} else {
			for (formNo = 1; formNo <= document.forms.length; formNo++) {
				formHandle = document.forms [formNo - 1];
				if (formHandle [instanceName] != null) {
					instanceID = formHandle [instanceName];
					break;
				}
			}
		}
		ready = (instanceID != null);
		if (ready) {
			eval (initFunctionStr);
			if (initFunction != null) {initFunction ()}
		} else {
			setTimeout (objectName + '.setReady ("' + initFunctionStr + '")',500);
		}
	}
}

function mo_setMonophonic (channelNo,state) {
	with (this) {
		if (channelNo == 0) {
			for (var channelCount = 1; channelCount <= 16; channelCount++) {
				monophonic [channelCount - 1] = state;
			}
		} else {
			monophonic [channelNo - 1] = state;
		}
	}
}

function mo_getMonophonic (channelNo) {
	with (this) {
		if (channelNo >= 1 && channelNo <= 16) {
			return monophonic [channelNo - 1];
		} else {
			return false;
		}
	}
}

function mo_noteOn (channelNo,p2,p3,p4,p5) {
	with (this) {
		if (ready) {
			if (monophonic [channelNo - 1]) {
				noteOff (channelNo,notesOn [channelNo - 1],127);
			}
			if (p4 != null && p5 != null) {
				if (typeof (p4) == 'string') {
					p4 = getNoteNumber (p4);
				}
				notesOn [channelNo - 1] = p4;
				instanceID.noteOn (channelNo,p2,p3,p4,p5);
			} else {
				if (typeof (p2) == 'string') {
					p2 = getNoteNumber (p2);
				}
				notesOn [channelNo - 1] = p2;
				instanceID.noteOn (channelNo,p2,p3);
			}
		}
	}
}

function mo_noteOff (channelNo,noteNo) {
	with (this) {
		if (ready) {
			if (noteNo == null) {noteNo = notesOn [channelNo - 1]}
			notesOn [channelNo - 1] = 0;
			if (typeof (noteNo) == 'string') {
				noteNo = getNoteNumber (noteNo);
			}
			instanceID.noteOff (channelNo,noteNo,127);
		}
	}
}

function mo_playNote (p1,p2,p3,p4,p5,p6) {
	with (this) {
		if (ready) {
			if (monophonic [p1 - 1]) {
				noteOff (p1,notesOn [p1 - 1],127);
			}
			if (p5 != null & p6 != null) {
				if (typeof (p4) == 'string') {
					p4 = getNoteNumber (p4);
				}
				noteOn (p1,p2,p3,p4,p5);
				setTimeout (objectName + '.noteOff (' + p1 + ',' + p4 + ',' + p5 + ')',p6);
			} else if (p3 != null && p4 != null) {
				if (typeof (p2) == 'string') {
					p2 = getNoteNumber (p2);
				}
				noteOn (p1,p2,p3,p4);
				setTimeout (objectName + '.noteOff (' + p1 + ',' + p2 + ',' + p3 + ')',p4);
			} else {
				with (p2) {
					playNote (p1,bankNo,programNo,noteNo,velocity,duration);
				}
			}
		}
	}
}

function mo_setGlobalMute (muteState) {
	if (this.ready) {this.instanceID.setGlobalMute (muteState)}
}

function mo_setPanelDisplay (displayType) {
	if (this.ready) {this.instanceID.setPanelDisplay (displayType)}
}

function mo_setPanelMode (panelMode) {
	if (this.ready) {this.instanceID.setPanelMode (panelMode)}
}

function mo_setVolume (volume) {
	if (this.ready) {this.instanceID.setVolume (volume)}
}

function mo_setTranspose (transpose) {
	if (this.ready) {this.instanceID.setTranspose (transpose)}
}

function mo_setTempo (tempo) {
	if (this.ready) {this.instanceID.setTempo (tempo)}
}

function mo_setReverbType (reverbType) {
	if (this.ready) {this.instanceID.setReverbType (reverbType)}
}

function mo_setController (channelNo,controllerNo,controllerValue) {
	if (this.ready) {this.instanceID.setController (channelNo,controllerNo,controllerValue)}
}

function mo_setProgram (channelNo,p2,p3) {
	with (this) {
		if (ready) {
			if (p3 != null) {
				instanceID.setProgram (channelNo,p2, p3);
			} else {
				instanceID.setProgram (channelNo,p2);
			}
		}
	}
}

function mo_setTrackMute (trackNo,state) {
	if (this.ready) {this.instanceID.setTrackMute (trackNo,state)}
}

function mo_setChannelMute (channelNo,state) {
	with (this) {
		if (ready) {
			if (typeof (channelNo) == 'object') {
				for (var channelCount = 1; channelCount <= channelNo.length; channelCount++) {
					instanceID.setChannelMute (channelNo [channelCount - 1],state);
				}
			} else if (channelNo == 0) {
				for (var channelCount = 1; channelCount <= 16; channelCount++) {
					instanceID.setChannelMute (channelCount,state)
				}
			} else {
				instanceID.setChannelMute (channelNo,state)
			}
		}
	}
}

function mo_setTrackSolo (trackNo,state) {
	if (this.ready) {this.instanceID.setTrackSolo (trackNo,state)}
}

function mo_setChannelSolo (channelNo,state) {
	if (this.ready) {this.instanceID.setChannelSolo (channelNo,state)}
}

function mo_getPanelDisplay () {
	if (this.ready) {return this.instanceID.getPanelDisplay ()} else {return ""}
}

function mo_getPanelMode (panelMode) {
	if (this.ready) {return this.instanceID.getPanelMode ()} else {return ""}
}

function mo_getVolume () {
	if (this.ready) {return this.instanceID.GetVolume ()} else {return 100}
}

function mo_getAutostart () {
	if (this.ready) {return this.instanceID.getAutostart ()} else {return false}
}

function mo_getLoop () {
	if (this.ready) {return this.instanceID.getLoop ()} else {return false}
}

function mo_getReverbType () {
	if (this.ready) {return this.instanceID.getReverbType ()} else {return 0}
}

function mo_getTempo () {
	if (this.ready) {return this.instanceID.getTempo ()} else {return 120}
}

function mo_getTranspose () {
	if (this.ready) {return this.instanceID.getTranspose ()} else {return 0}
}

function mo_getController (channelNo,controllerNo) {
	if (this.ready) {return this.instanceID.getController (channelNo,controllerNo)} else {return 0}
}

function mo_getProgram (channelNo) {
	if (this.ready) {return this.instanceID.getProgram (channelNo)} else {return 0}
}

function mo_getTrackMute (trackNo) {
	if (this.ready) {return this.instanceID.getTrackMute (trackNo)} else {return false}
}

function mo_getChannelMute (channelNo) {
	if (this.ready) {return this.instanceID.getChannelMute (channelNo)} else {return false}
}

function mo_getTrackSolo (trackNo) {
	if (this.ready) {return this.instanceID.getTrackSolo (trackNo)} else {return false}
}

function mo_getChannelSolo (channelNo) {
	if (this.ready) {return this.instanceID.getChannelSolo (channelNo)} else {return false}
}

function mo_getInfo (infoField) {
	if (this.ready) {return this.instanceID.getInfo (infoField)} else {return ''}
}

function mo_isPaused () {
	if (this.ready) {return this.instanceID.IsPaused ()} else {return false}
}

function mo_isPlaying () {
	if (this.ready) {return this.instanceID.IsPlaying ()} else {return false}
}

function mo_isReady () {
	return this.ready;
}

function mo_getNoteNumber (noteName) {
	var noteOffset, returnVal, sharpFlatOffset, sharpPosOffset, octaveNo;
	noteOffset = noteNumbers [noteName.substring (0,1).toLowerCase ()];
	returnVal = 0;
	if (noteOffset != null) {
		sharpFlatOffset = 0;
		sharpFlatPos = noteName.indexOf ('b',1);
		if (sharpFlatPos == -1) {
			sharpFlatPos = noteName.indexOf ('#',1);
			if (sharpFlatPos == -1) {
				sharpFlatPos = 0;
			} else {
				sharpFlatOffset = 1;
			}
		} else {
			sharpFlatOffset = -1;
		}
		octaveNo = noteName.substring (sharpFlatPos+1,noteName.length) - 0;
		returnVal =  12 + octaveNo * 12 + noteOffset + sharpFlatOffset;
	}
	returnVal = Math.floor (returnVal);
	return returnVal;
}

function mo_getNoteName (noteNumber) {
	return noteNames [noteNumber % 12] + (Math.floor (noteNumber / 12) - 1) + "";
}

function mo_getVersion () {
	return ('1.5');
}

function mo_setInitFunction (initFunction) {
	this.initFunction = initFunction;
}

function mo_execOnPlay () {
	with (this) {
		if (onPlayFunction != null) {
			if (typeof (onPlayFunction) == 'string') {
				eval (onPlayFunction);
			} else {
				onPlayFunction ();
			}
		}
	}
}

function mo_onPlay (onPlayFunction) {
	this.onPlayFunction = onPlayFunction;
}

function mo_execOnPause () {
	with (this) {
		if (onPauseFunction != null) {
			if (typeof (onPauseFunction) == 'string') {
				eval (onPauseFunction);
			} else {
				onPauseFunction ();
			}
		}
	}
}

function mo_onPause (onPauseFunction) {
	this.onPauseFunction = onPauseFunction;
}

function mo_execOnStop () {
	with (this) {
		if (onStopFunction != null) {
			if (typeof (onStopFunction) == 'string') {
				eval (onStopFunction);
			} else {
				onStopFunction ();
			}
		}
	}
}

function mo_onStop (onStopFunction) {
	this.onStopFunction = onStopFunction;
}

function mo_execOnMetaEvent (eventType,eventValue) {
	with (this) {
		if (onMetaEventFunction != null) {
			onMetaEventFunction (eventType,eventValue);
		}
	}
}

function mo_onMetaEvent (onMetaEventFunction) {
	this.onMetaEventFunction = onMetaEventFunction;
}

function mo_getPlatform () {
	return (navigator.userAgent);
}

function mo_setPosition (positionMilliseconds) {
	if (this.ready) {this.instanceID.SetPosition (positionMilliseconds)}	
}

function mo_getPosition () {
	if (this.ready) {return this.instanceID.GetPosition ()}	
}

function mo_getPlayLength () {
	if (this.ready) {return this.instanceID.getPlayLength ()}	
}

function mo_getFileSize () {
	if (this.ready) {return this.instanceID.getFileSize ()}	
}

function musicObject (objectName,initFunction) {
	this.fadeTimeout = setTimeout ('//',0);

	this.objectName = objectName;
	this.instanceName = objectName + "Plugin";
	this.ready = false;
	this.instanceID = null;
	this.initFunction = initFunction;
	this.onPauseFunction = null;
	this.onStopFunction = null;
	this.onMetaEventFunction = null;
	this.onPlayFunction = null;

	//*** Reflected Plug-in Methods
	this.fadeTo = mo_fadeTo;
	this.fadeFromTo = mo_fadeFromTo;
	this.getAutostart = mo_getAutostart;
	this.getChannelMute = mo_getChannelMute;
	this.getChannelSolo = mo_getChannelSolo;
	this.getController = mo_getController;
	this.getFileSize = mo_getFileSize;
	this.getInfo = mo_getInfo;
	this.getLoop = mo_getLoop;
	this.getPanelDisplay = mo_getPanelDisplay;
	this.getPanelMode = mo_getPanelMode;
	this.getPlayLength = mo_getPlayLength
	this.getPosition = mo_getPosition;
	this.getProgram = mo_getProgram;
	this.getReverbType = mo_getReverbType;
	this.getTempo = mo_getTempo;
	this.getTranspose = mo_getTranspose;
	this.getTrackMute = mo_getTrackMute;
	this.getTrackSolo = mo_getTrackSolo;
	this.getVolume = mo_getVolume;
	this.isPaused = mo_isPaused;
	this.isPlaying = mo_isPlaying;
	this.isReady = mo_isReady;
	this.noteOff = mo_noteOff;
	this.noteOn = mo_noteOn;
	this.pause = mo_pause;
	this.play = mo_play;
	this.playGroovoid = mo_playGroovoid;
	this.playNote = mo_playNote;
	this.setAutostart = mo_setAutostart;
	this.setChannelMute = mo_setChannelMute;
	this.setChannelSolo = mo_setChannelSolo;
	this.setController = mo_setController;
	this.setGlobalMute = mo_setGlobalMute;
	this.setLoop = mo_setLoop;
	this.setPanelDisplay = mo_setPanelDisplay;
	this.setPanelMode = mo_setPanelMode;
	this.setPosition = mo_setPosition;
	this.setProgram = mo_setProgram;
	this.setReverbType = mo_setReverbType;
	this.setTempo = mo_setTempo;
	this.setTranspose = mo_setTranspose;
	this.setTrackMute = mo_setTrackMute;
	this.setTrackSolo = mo_setTrackSolo;
	this.setVolume = mo_setVolume;
	this.stop = mo_stop;

	//*** Extended Authoring API Methods
	this.getMonophonic = mo_getMonophonic;
	this.getNoteName = mo_getNoteName;
	this.getNoteNumber = mo_getNoteNumber;
	this.getPlatform = mo_getPlatform;
	this.getVersion = mo_getVersion;
	this.magicEmbed = mo_magicEmbed;
	this.onMetaEvent = mo_onMetaEvent;
	this.onPause = mo_onPause;
	this.onPlay = mo_onPlay;
	this.onStop = mo_onStop;
	this.preloadEmbed = mo_preloadEmbed;
	this.setInitFunction = mo_setInitFunction;
	this.setMonophonic = mo_setMonophonic;
	this.stubEmbed = mo_stubEmbed;

	//*** Internal Methods
	this.execOnMetaEvent = mo_execOnMetaEvent;
	this.execOnPause = mo_execOnPause;
	this.execOnPlay = mo_execOnPlay;
	this.execOnStop = mo_execOnStop;
	this.pauseAtZero = mo_pauseAtZero;
	this.setReady = mo_setReady;

	//*** LiveAudio Compatibility Methods
	this.fade_to = mo_fadeTo;
	this.fade_from_to = mo_fadeFromTo;
	this.GetVolume = mo_getVolume;
	this.IsPaused = mo_isPaused;
	this.IsPlaying = mo_isPlaying;
	this.IsReady = mo_isReady;
	this.setvol = mo_setVolume;

	//*** State Variables
	this.monophonic = new Array (false,false,false,false,false,false,false,false,false,false,false,false,false,false,false);
	this.notesOn = new Array (0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);

	window [this.objectName] = this;
//	eval ('alert (' + this.objectName + '.objectName)');
	return this;
}
