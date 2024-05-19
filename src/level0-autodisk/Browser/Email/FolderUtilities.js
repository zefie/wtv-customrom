// This file contains various JavaScript utility functions to support
// the offline email folder data structure.
// August 24, 1999
// Copyright 1999, WebTV Networks, Inc.

// Presently, there are three folders:
//	1) InBox
//	2) OutBox
//	3) Deleted


function MailFolder(name, ascendingSort)
{
	this.name = name;
	this.letters = new Array();
	this.ascending = ascendingSort;
}

function MailFolder_length(folder)
{
	return folder.letters.length;
}

function MailFolder_SetAscending(folder, ascendingSort)
{
	folder.ascending = ascendingSort;
}

function MailFolder_GetLetterXML(folder, index)
{
	return folder.letters[index].xml;
}

function MailFolder_GetLetter(folder, index)
{
	var letters = folder.letters[index].xml.getElementsByTagName("letter");
	return letters[0];
}

function MailFolder_SaveLetter(folder, index)
{
	var letterXML = folder.letters[index].xml;
	letterXML.toXML(top.FixFilenameForXMLWriting(folder.letters[index].url));
}

function MailFolder_DeleteLetter(folder, index, deleteFromDisk)
{
	var deletedLetter = ReturnDeletedLetter(folder, index);
	if (deletedLetter) {
		if (deleteFromDisk) {
			var letterStore = newStore(top.FixFilenameForStoreWriting(deletedLetter.url));
			letterStore.data = "";	// this deletes the letter
		}
		delete deletedLetter;
	}
}

function DumpFolder(folder, name)
{
	window.message("DUMPING folder ", name, " len = ", folder.letters.length);
	for (var i = 0; i < folder.letters.length; i++) {
		var letter = MailFolder_GetLetter(folder, i);
		window.message("letter ", i, " msg id = ", letter.getAttribute("msgid"));
	}
}

function ReturnDeletedLetter(folder, index)
{
	var oldMsg;
	var len = folder.letters.length;
	if (index >= 0 && index < len) {
		oldMsg = folder.letters[index];

		--len;
		for (var i = index; i < len; i++) {
			folder.letters[i] = folder.letters[i+1];
		}

		--folder.letters.length;	// shrink the array
	}
	return oldMsg
}

function MailFolder_DeleteAllLetters(folder)
{
	var len = folder.letters.length;
	for (var i = len - 1; i >= 0; i--) {
		delete folder.letters[i];
	}
	folder.letters.length = 0;	// shrink the array
}

function MailFolder_AddLetter(folder, xmlRoot, letterUrl, originalFolder)	// gets added in appropriate sorted order
{
	// Since letters are always sorted by date, grab the date out of the xml
	// letter and convert it to a number that can easily be used for quick comparisons.

	var sendDates = xmlRoot.getElementsByTagName("send_date");
	var sendDate = sendDates[0].firstChild.text;
	var jsDate = new Date(sendDate);

	var letter			= new Object();
	letter.time			= jsDate.getTime();
	letter.xml			= xmlRoot;
	letter.url			= letterUrl;
	letter.orgFolder	= originalFolder;			// remember the letter's original folder

	AddLetterObject(folder, letter);
}

function AddLetterObject(folder, letterObj)
{
	// Add the letter in the correct order
	for (var i = 0; i < folder.letters.length; i++) {
		if (folder.ascending) {
			if (letterObj.time < folder.letters[i].time)
				break;	// letter gets inserted at i
		} else {
			if (letterObj.time > folder.letters[i].time)
				break;	// letter gets inserted at i
		}
	}
	// Make a space for the new letter
	for (var j = folder.letters.length; j > i; --j)
		folder.letters[j] = folder.letters[j-1];

	folder.letters[i] = letterObj;

	return i;
}

function MailFolder_MoveLetter(srcFolder, srcIndex, destFolder)
{
	if (srcFolder != destFolder) {
		var oldLetter = ReturnDeletedLetter(srcFolder, srcIndex);
		if (oldLetter) {
			return AddLetterObject(destFolder, oldLetter);
		}
	}
	return -1;
}

function MailFolder_RestoreLetter(srcFolder, srcIndex)
{
window.message("MailFolder_RestoreLetter orig folder ", srcFolder.letters[srcIndex].orgFolder);
	var originalFolder = eval(srcFolder.letters[srcIndex].orgFolder);
	if (originalFolder != srcFolder) {
		var oldLetter = ReturnDeletedLetter(srcFolder, srcIndex);
window.message("old letter = ", oldLetter);
		if (oldLetter) {
			return AddLetterObject(originalFolder, oldLetter);
		}
	}
	return -1;
}

function LoadAllFolders()
{
	// clear all folders first
	MailFolder_DeleteAllLetters(top.gInFolder);
	MailFolder_DeleteAllLetters(top.gOutFolder);
	MailFolder_DeleteAllLetters(top.gDeletedFolder);

	// load the inbox, outbox, and deleted folders
	var messageCnt = top.gInFolderStore.length;
	for (i = 0; i < messageCnt; i++) {
		var letterStore = top.gInFolderStore[i];
		var letterUrl = letterStore.location;
		var xml = NewXMLDocument();
		if (xml.load(letterUrl)) {
			var letters = xml.getElementsByTagName("letter");
			letter = letters[0];
			deleted = letters[0].getAttribute("deleted") == "y";
			if (deleted)
				MailFolder_AddLetter(top.gDeletedFolder, xml, letterUrl, "top.gInFolder");
			else
				MailFolder_AddLetter(top.gInFolder, xml, letterUrl, "top.gInFolder");
		} else {
			window.message("LoadAllFolders - couldn't load ", letterUrl);
		}
	}

	messageCnt = top.gOutFolderStore.length;
	for (i = 0; i < messageCnt; i++) {
		var letterStore = top.gOutFolderStore[i];
		var letterUrl = letterStore.location;
		var xml = NewXMLDocument();
		if (xml.load(letterUrl)) {
			var letters = xml.getElementsByTagName("letter");
			letter = letters[0];
			deleted = letters[0].getAttribute("deleted") == "y";
			if (deleted)
				MailFolder_AddLetter(top.gDeletedFolder, xml, letterUrl, "top.gOutFolder");
			else
				MailFolder_AddLetter(top.gOutFolder, xml, letterUrl, "top.gOutFolder");
		} else {
			window.message("LoadAllFolders - couldn't load ", letterUrl);
		}
	}
}

function GetNewMessageCounts()
{
	var counts = new Array();
	for (var j = 0; j < top.gMaxUsers; j++) {
		counts[j] = 0;
		System.extendScriptIdle(1000);
		if (j < top.gUserCount) {
			var userID	 = top.gUserInfos[j].getAttribute("UserID");

			var inFolderDir = top.gPath.InBoxDir + userID + "/";
			var inFolder;

			if (top.XMLBuiltIn()) {
				inFolder = new Store(inFolderDir);
			} else {
				inFolder = new document.Store(inFolderDir);
			}

			var messageCnt = inFolder.length;
			for (i = 0; i < messageCnt; i++) {
				System.extendScriptIdle(1000);
				var letterStore = inFolder[i];
				var letterUrl = letterStore.location;
				var xml = NewXMLDocument();
				if (xml.load(letterUrl)) {
					var letters = xml.getElementsByTagName("letter");
					letter = letters[0];
					unread = letter.getAttribute("hasRead") == "u";
					if (unread)
						++counts[j];
				} else {
					window.message("GetNewMessageCounts - couldn't load ", letterUrl);
				}
			}
		}
	}
	return counts;
}

