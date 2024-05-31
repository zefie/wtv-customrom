// This file contains various JavaScript utility functions to support
// syncing offline email with the service.
// Agust 9, 1999
// Copyright 1999, WebTV Networks, Inc.

// NOTE - the whole progress bar stuff in here is kind of whacky. The reason is
// that computing how much stuff there is to process is very time consuming; almost
// as expensive as processing the data itself. Therefore, the progress bar is divided
// up into thirds. The first third is for sending mail, the second third to computing
// what has been read and deleted, and the last third to receiving mail and address books.

var kSendPercentage = 0.3333;
var kRecvPercentage = 0.3333;
var kSyncPercentage = 0.3333;
var gPercentDone	= 0.0;

var kCompleteStatus = 200;
var kErrorStatus = 400;

function SendRecvResource(sendObj)
{
	// top.gRequest.priority = 6; - this function only available in 3.0, not 2.5

	var done = false;
	sendObj.status = 0;
	var statusCnt = 0;

	while (!done) {
		sendObj.status = sendObj.isPost ? top.gRequest.status(sendObj.postData) : top.gRequest.status();
		if (sendObj.status >= kErrorStatus)
			done = true;
		if (sendObj.status == kCompleteStatus) {	
			done = true;
		}
		++statusCnt;
		window.message("status = ", sendObj.status, " done ", done);
	}
	sendObj.result = "";
	if (sendObj.status == kCompleteStatus) {
		window.message("STATUS checked times = ", statusCnt, " isPost ", sendObj.isPost, " post data ", sendObj.postData);
		window.message("status = ", sendObj.status);
		sendObj.result =  sendObj.isPost ? top.gRequest.data(sendObj.postData) : top.gRequest.data();
		window.message(sendObj.result.substring(0,100));	// printing out long strings generates an error
	} else {
		sendObj.result = "BAD";
		var L_TechProblem_Text = "MSN TV ran into a technical problem. Please try again.";
		var msg = L_TechProblem_Text + "(service sent = ", sendObj.status, ")";	
		window.message("SYNC alert - " + msg);
		alertPriv(L_TechProblem_Text, top.gAlertIconURL, top.L_Continue_Text);
	}

	return sendObj.status == kCompleteStatus;
}

function SendAddressBook()
{
	window.message("SENDING OFFLINE EMAIL ADDRESS BOOK");

	ShowMessage("sendingAdrBook");

	var result = true;

	for (var j = 0; result && j < top.gServiceUserCount; j++) {
		var user = top.gServiceUserInfos[j];
		if (user.getAttribute("mail-enabled") == "true") {
			var userID = user.getAttribute("userid");
			var userName = user.getAttribute("user-name");

			// Figure out if the address book has changed

			var adrFileName = top.gPath.AdrBookFilename + userName + ".xml";

			var xmlAdrFileName = "file://" + top.L_Disk_FileName + adrFileName;
	window.message("loading addr book ", xmlAdrFileName);
			if (top.xmldoc.load(xmlAdrFileName)) {
				var addresses = top.xmldoc.getElementsByTagName("AddressBook");
				var address = addresses[0];

				var changed = address.getAttribute("changed") == "true";
		window.message("addr book changed ", changed);

				if (changed == true) {
				window.message("Trying to open addressbook as store object ", adrFileName);

					var addressBook = top.newStore(adrFileName);
					var addressData = escape(addressBook.data);

					if (addressData != null) {
						var postData = "userid=" + userID
								+ "&ADDRESSBOOK=" + addressData;

				window.message("Sending addr data ", addressBook.data);

						top.gRequest.postdata("wtv-mail:/set-addressbook-xml", postData);

						var sendObj = new Object;
						sendObj.isPost = true;
						sendObj.postData = postData;
						result = SendRecvResource(sendObj);

						if (result) {
							// Mark the address book as "not changed".
							address.setAttribute("changed", false)

							// write the address book back out
							var filename = top.L_Disk_FileName + adrFileName;
						window.message("Saving xml address book to ", filename);
							top.xmldoc.toXML(filename);
						}
					}
				}
			}
		} else {
			window.message("SendAddressBook - couldn't load ", xmlAdrFileName);
		}
	}
	window.message("returning from SendAddressBook = ", result);
	return result;
}

function GetAddressBook()
{
	window.message("GETTING OFFLINE EMAIL ADDRESS BOOK");

	ShowMessage("receivingAdrBook");

	var result = true;

	for (var j = 0; result && j < top.gServiceUserCount; j++) {
		var user = top.gServiceUserInfos[j];
		if (user.getAttribute("mail-enabled") == "true") {
			var userID = user.getAttribute("userid");
			var userName = user.getAttribute("user-name");

			top.gRequest.url = "wtv-mail:/get-addressbook-xml?"
				+ "userid=" + userID;
			window.message("top.gRequest.url = ", top.gRequest.url);

			var sendObj = new Object;
			sendObj.isPost = false;
			result = SendRecvResource(sendObj);
			if (result) {
				var adrFileName = top.gPath.AdrBookFilename + userName + ".xml";
		window.message("address book = ", sendObj.result);
				var addressBook = top.newStore(adrFileName);
				addressBook.data = sendObj.result;

				// Mark the address book as "not changed".
				var xmlAdrFileName = "file://" + top.L_Disk_FileName + adrFileName;
				if (top.xmldoc.load(xmlAdrFileName)) {
					var addresses = top.xmldoc.getElementsByTagName("AddressBook");
					var address = addresses[0];
					address.setAttribute("changed", false)

					// write the address book back out
					var filename = top.L_Disk_FileName + adrFileName;
				window.message("Saving xml address book to ", filename);
					top.xmldoc.toXML(filename);
				} else {
					window.message("GetAddressBook - couldn't load ", xmlAdrFileName);
				}
			}
		}
	}
	return result;
}

function SendMail()
{
	var result = true;

	UpdateProgressBar(gPercentDone);
	var chunkPerUser = 100 / top.gServiceUserCount;

	ShowMessage("sendingMailText");

	for (var j = 0; result && j < top.gServiceUserCount; j++) {
		var user = top.gServiceUserInfos[j];
		if (user.getAttribute("mail-enabled") == "true") {
			var userID = user.getAttribute("userid");

			var outFolder = top.OpenOutFolder(userID);
			var outboxCount = outFolder.length;

			window.message("SENDING OFFLINE EMAIL OUTBOX for ", userID, " messages to send = ", outboxCount);

			var whichMsg = 0;

			for (var i = 0; result && i < outboxCount; i++) {
				var letterStore = outFolder[whichMsg];
				var letterUrl = letterStore.location;
	window.message("+++++++++++ SSSSSSSSSSSSsending url ", letterUrl);

				// read the xml letter data
				if (top.xmldoc.load(letterUrl)) {
					var letters = top.xmldoc.getElementsByTagName("letter");
					var letter = letters[0];
					var deleted = letter.getAttribute("deleted");
					if (deleted != "y") {
						var msgID = letter.getAttribute("msgid");

						var senders = top.xmldoc.getElementsByTagName("sender_name");
						senderName = senders[0].firstChild;

						var senderAddresses = top.xmldoc.getElementsByTagName("sender_address");
						senderAddress = senderAddresses[0].firstChild;

						var ccs = top.xmldoc.getElementsByTagName("cc");
						ccAddress = ccs[0].firstChild;

						var subjects = top.xmldoc.getElementsByTagName("subject");
						subject = subjects[0].firstChild;
						if (subject == null)
							subject = "";

						var bodies = top.xmldoc.getElementsByTagName("message");
						body = bodies[0].firstChild;
						if (body == null)
							body = "";

						var postData = "no-save-copy: true&message_to=" + escape(senderAddress)
							+ "&userid=" + userID;

						if (ccAddress != null)
							postData += "&message_cc=" + escape(ccAddress);

						postData += "&message_subject=" + escape(subject)
							+ "&message_body=" + escape(body)
							+ "&wtv-saved-message-id=writemessage-outbox"	// don't know what this is
							+ "&Send=Send&sendoff=Send&no_signature=true"	// don't know what this is
							+ "&non-interactive=true";

			window.message("Post data = ", postData);

						top.gRequest.postdata("wtv-mail:/sendmail", postData);
						var sendObj = new Object;
						sendObj.isPost = true;
						sendObj.postData = postData;
						result = SendRecvResource(sendObj);
			window.message("Result from post = ", result);
					} else
						result = true;	// force the deleted message that we didn't send to get deleted

					if (result) {
						// delete the message
						window.message("deleting message ", letterStore.location);
						letterStore.data = "";
					} else {
						++whichMsg;
					}
				} else {
					window.message("SendMail - couldn't load ", letterUrl);
				}
			}
		}
		UpdateProgressBar((chunkPerUser * j + chunkPerUser / outboxCount * i) * kSendPercentage);
	}
	gPercentDone = kSendPercentage * 100.0;
	UpdateProgressBar(gPercentDone);
	return result;
}

function DeleteDeletedFolder(folder)
{
	var count = folder.length;
	for (var i = 0; i < count; i++) {
		var letterStore = folder[i];
		var letterUrl = letterStore.location;

		// read the xml letter data
		if (top.xmldoc.load(letterUrl)) {
			var letters = top.xmldoc.getElementsByTagName("letter");
			var letter = letters[0];

			var deleted = letter.getAttribute("deleted");

			if (deleted == "y") {
				window.message("Deleting msg ", letterUrl);

				letterStore.data = "";	// this deletes the file
				--count;
				--i;		// have to reset the iterator to get the next letter
			}
		} else {
			window.message("DeleteDeletedFolder - couldn't load ", letterUrl);
		}
	}
}

function DeleteDeletedMsgs()
{
	// after a successful sync, we delete any messages marked "deleted"
	// from the inbox and outbox

	window.message("DELETING DELETED MESSAGES");

	ShowMessage("deletingMsgText");

	for (var j = 0; j < top.gServiceUserCount; j++) {
		var user = top.gServiceUserInfos[j];
		if (user.getAttribute("mail-enabled") == "true") {
			var userID = user.getAttribute("userid");

			var outFolder = top.OpenOutFolder(userID);
			var inFolder = top.OpenInFolder(userID);

			DeleteDeletedFolder(outFolder);
			DeleteDeletedFolder(inFolder);
		}
	}
}

function SyncMail()
{
	window.message("SYNCING OFFLINE EMAIL");
	var result = true;

	ShowMessage("checkingMsgText");
	var chunkPerUser = 100 / top.gServiceUserCount;

	// calculate number of "enabled" users
	var enabledUsers = 0;
	for (var u = 0; u < top.gServiceUserCount; u++) {
		var user = top.gServiceUserInfos[u];
		if (user.getAttribute("mail-enabled") == "true")
			enabledUsers++;
	}	

	var params = "," + top.gConfig.MaxInDiskSpace + "," + top.gConfig.MaxInBoxMsgSize
			+ "," + enabledUsers + "," + top.gConfig.MaxInSpacePerUser;

	var emailType = top.gIsOfflineEmail ? "offline" : "free";
	var postData = "PARMS=" + emailType + params;

	for (var j = 0; j < top.gServiceUserCount; j++) {
		var user = top.gServiceUserInfos[j];
		if (user.getAttribute("mail-enabled") == "true") {
			var userID = user.getAttribute("userid");

			var outFolder = top.OpenOutFolder(userID);
			var inFolder = top.OpenInFolder(userID);

			var outboxCount = outFolder.length;

			window.message("outboxCount = ", outboxCount);

			// Build the mail message synch string
			var inboxStr = "";
			var deletedStr = "";
			var inboxCount = inFolder.length;
			window.message("inboxCount = ", inboxCount);
			for (var i = 0; i < inboxCount; i++) {
				window.message("Looking up inFolder i = ", i);
				var letterStore = inFolder[i];
				var letterUrl = letterStore.location;
				window.message("letterUrl = ", letterUrl);
		
				// read the xml letter data
				if (top.xmldoc.load(letterUrl)) {
					var letters = top.xmldoc.getElementsByTagName("letter");
					var letter = letters[0];

					var emailStatus = letter.getAttribute("hasRead");
					var msgid = letter.getAttribute("msgid");
					var deleted = letter.getAttribute("deleted");

					if (deleted == "y") {
						if (deletedStr.length > 0)
							deletedStr += ",";
						deletedStr += msgid + ":" + emailStatus;
					} else {
						if (inboxStr.length > 0)
							inboxStr += ",";
						inboxStr += msgid + ":" + emailStatus;
					}
				} else {
					window.message("SyncMail - couldn't load ", letterUrl);
				}
				UpdateProgressBar((chunkPerUser * j + chunkPerUser / inboxCount * i) * kSyncPercentage + gPercentDone);
			}
			postData += "&INBOX=" + userID + ";" + inboxStr + "&DELETED=" + userID + ";" + deletedStr;
		}
	}
	if (top.gBoxLostMind)
		postData = "refresh=1&" + postData;

	window.message("trying top.gRequest.postData");
	top.gRequest.postdata("wtv-mail:/sync-offline-mail", postData);
	window.message("did top.gRequest");
	var sendObj = new Object;
	sendObj.isPost = true;
	sendObj.postData = postData;
	window.message("Synching data: ", postData);
	result = SendRecvResource(sendObj);
	window.message("back from Synching data");
	if (result) {
		window.message("calling DeleteDeletedMsgs");
		DeleteDeletedMsgs();
		window.message("back from calling DeleteDeletedMsgs");
		result = ParseSyncResult(sendObj.result);
		window.message("back from calling ParseSyncResult");
	}

	return result;
}

var gLastStr;
var gIndex;

function GetWord(str, delim)	// return the next word from str. As long as the str parameter stays the
								// same, GetWord will keep returning sequential words.
{
	if (str != gLastStr) {
		gLastStr = str;
		gIndex = 0;
	}

	//window.message("GetWord index ", gIndex, ' string "', gLastStr, '"');

	if (gIndex < str.length) {
		var pos = -1;
		var lastPos = 99999;

		// Find the first delimiter specified in the "delim" list

		for (i = 0; i < delim.length; i++) {
			var indDelim = delim.substring(i, i + 1);
			pos = str.indexOf(indDelim, gIndex);	// check for specified delimiter
			if (pos >= 0 && pos < lastPos)
				lastPos = pos;
		}
		pos = lastPos;

		if (pos >= 0) {
			var word = str.substring(gIndex, pos);

			gIndex = pos + 1;
			return word;
		} else {
			var word = str.substring(gIndex);
			gIndex = str.length;
			return word;
		}
	}
	return "";
}

function ResetMail()
{
	// delete all the letters in the inbox

	window.message("RESETTING OFFLINE EMAIL");

	for (var j = 0; j < top.gServiceUserCount; j++) {
		var user = top.gServiceUserInfos[j];
		if (user.getAttribute("mail-enabled") == "true") {
			var userID = user.getAttribute("userid");

			var inFolder = top.OpenInFolder(userID);
			var inboxCount = inFolder.length;

			for (var i = inboxCount - 1; i >= 0; i--) {
				var letterStore = inFolder[i];
				window.message("deleting letterStore.url = ", letterStore.location);
				letterStore.data = "";	// this deletes the file!
			}
		}
	}
}

function DeleteMessage(userid, mailbox, msgid)
{
	window.message("DELETING MESSAGE from box ", mailbox, " message id ", msgid);

	var folderPath = "";

	if (mailbox == "inbox") {
		folderPath = top.gPath.InBoxDir;
	} else if (mailbox == "outbox") {
		folderPath = top.gPath.OutBoxDir;
	} else {
		window.message("UNKNOWN MAILBOX: '", mailbox, "'");
	}
	if (folderPath != "") {
		var msgPath = folderPath + userid + "/" + msgid + ".xml";
		window.message("Deleting msg ", msgPath);
		var messageStore = top.newStore(msgPath);
		messageStore.data = "";	// this deletes the file
	}
}

function ModifyMessage(userid, mailbox, msgid, cmd)
{
	window.message("MODIFYING MESSAGE from box ", mailbox, " message id ", msgid);

	var folderPath = "";

	if (mailbox == "inbox") {
		folderPath = top.gPath.InBoxDir;
	} else if (mailbox == "outbox") {
		folderPath = top.gPath.OutBoxDir;
	} else {
		window.message("UNKNOWN MAILBOX: '", mailbox, "'");
	}
	if (folderPath != "") {
		var msgPath = top.L_Disk_FileName + folderPath + userid + "/" + msgid + ".xml";
		window.message("Modifying msg ", msgPath);

		if (top.xmldoc.load("file://" + msgPath)) {
			var letters = top.xmldoc.getElementsByTagName("letter");
			var letter = letters[0];

			if (cmd == 'r' || cmd == 'R') {
				letter.setAttribute("hasRead", "r");
				top.xmldoc.toXML(msgPath);
			}
		}
	}
}

function SetUserName(userName)
{
	window.message("SETTING USER NAME: ", userName);

	top.gUserInfo.setAttribute("UserName", userName);
	top.SaveUserAttributes();
}

function SetUserEmailAddress(emailAddress)
{
	window.message("SETTING USER EMAIL ADDRESS: ", emailAddress);

	top.gUserInfo.setAttribute("EmailAddress", emailAddress);
	top.SaveUserAttributes();
}

function SetUserUnsentCounts(userid, unreadCnt, notSentCnt)
{
	window.message("SETTING USER UNSENT Counts: ", userid);

	// find the user in our own XML user info object
	var userIndex = top.GetLocalUserIndex(userid);
	if (userIndex >= 0) {
		var userInfo = top.gUserInfos[userIndex];
		userInfo.setAttribute("UnsentUnreadCnt", unreadCnt);
		userInfo.setAttribute("UnsentReadCnt", notSentCnt);
		top.SaveUserAttributes();
	} else
		window.message("SetUserUnsentCounts: couldn't find user id ", userid);
}

function AddMailMessage(userid, mailbox, msgid, url)
{
	window.message("ADDING EMAIL to box ", mailbox, " message id ", msgid);
	window.message("Letter url ", url);

	var folderPath = "";
	var result = true;

	if (mailbox == "inbox") {
		folderPath = top.gPath.InBoxDir;
	} else if (mailbox == "outbox") {
		folderPath = top.gPath.OutBoxDir;
	} else {
		window.message("UNKNOWN MAILBOX: '", mailbox, "'");
	}
	if (folderPath != "") {
		top.top.gRequest.url = url;
		var sendObj = new Object;
		sendObj.isPost = false;
		result = SendRecvResource(sendObj);
		if (result) {
			var messageStore = top.newStore(folderPath + userid + "/" + msgid + ".xml");

			messageStore.data = sendObj.result;
		}
	}
	return result;
}

function SetParms(parm)
{
	var parms = parm.split(",");
	
	window.message("SETTING PARMS to ", parm);

	if (parms[0] == "offline") {
		top.gConfig.MaxInDiskSpace		= parms[1];
		top.gConfig.MaxInBoxMsgSize		= parms[2];
		top.gConfig.MaxInSpacePerUser	= parms[4];

		if (parms[3] != top.gUserInfos.length) {
			window.message("SetParms: parms[3] != top.gUserInfos.length");
		}

		top.gConfigInfo.setAttribute("MaxInDiskSpace", top.gConfig.MaxInDiskSpace);
		top.gConfigInfo.setAttribute("MaxInBoxMsgSize", top.gConfig.MaxInBoxMsgSize);
		top.gConfigInfo.setAttribute("MaxInSpacePerUser", top.gConfig.MaxInSpacePerUser);
	} else {
		top.gConfigInfo.setAttribute("MaxInDiskSpace", parms[1]);
		top.gConfigInfo.setAttribute("MaxInMsgs", parms[2]);
	}
	top.SaveConfigAttributes();
}

function ParseSyncResult(sync)
{
	window.message("SYNC RESULT:", sync);
	parms = sync.split('\n');

	gLastStr = "";
	var result = true;

	for (var i = 0; result && i < parms.length; i++) {

		while (result) {
			var word = GetWord(parms[i], "= ");
			window.message("word = ", word);
			switch (word) {
				case "RESET":
					ResetMail();
				//	GetAddressBook();
					break;

				case "ADD":
					var userid = GetWord(parms[i], " ");
					var mailbox = GetWord(parms[i], "/");
					var msgid = GetWord(parms[i], " ");
					var url = GetWord(parms[i], " ");
					result = AddMailMessage(userid, mailbox, msgid, url);
					break;

				case "PARMS":
					word = GetWord(parms[i], " ");
					SetParms(word);
					break;

				case "DELETE":
					var userid = GetWord(parms[i], " ");
					var mailbox = GetWord(parms[i], "/");
					var msgid = GetWord(parms[i], " ");
					DeleteMessage(userid, mailbox, msgid);
					break;

				case "NAME":
					word = GetWord(parms[i], "\n");
					SetUserName(word);
					break;

				case "ADDR":
					word = GetWord(parms[i], "\n");
					SetUserEmailAddress(word);
					break;

				case "UNSENT":
					var userid = GetWord(parms[i], " ");
					var unreadCnt = GetWord(parms[i], ",");
					var notSentCnt = GetWord(parms[i], "\n");
					SetUserUnsentCounts(userid, unreadCnt, notSentCnt);
					break;

				case "MODIFY":
					var userid = GetWord(parms[i], " ");
					var mailbox = GetWord(parms[i], "/");
					var msgid = GetWord(parms[i], " ");
					var cmd = GetWord(parms[i], "\n");
					ModifyMessage(userid, mailbox, msgid, cmd);
					break;

				default:
					if (word != "")
						window.message("DON'T UNDERSTAND '", word, "'");
					break;
			}

			if (word == "")
				break;
		}
		UpdateProgressBar((i/parms.length) * kRecvPercentage * 100.0 + gPercentDone);
	}
	gPercentDone += kRecvPercentage * 100.0;
	return result;
}

function Synchronize(hangUp)
{
	var wasOffline = top.gRequest.isOffline();
	var ok = true;
	var now = new Date();	// remember starting sync time
window.message(" now.toString() = ", now.toString());
	gPercentDone = 0.0;

	ok = SendMail();

	if (ok) {
		ok = SyncMail();

		if (ok) {
			if (top.gBoxLostMind)
				ok = GetAddressBook();
			else
				ok = SendAddressBook();
		}
	}
	if (hangUp)
		location = "client:HangupPhone";	// always disconnect after a sync - successful or not

	if (ok) {
		// record successful connection time
		var connectTime = now.toString();
		top.gConfigInfo.setAttribute("LastConnect", connectTime);
		top.SaveConfigAttributes();
		top.gBoxLostMind = false;
	}
	UpdateProgressBar(100.0);

	ShowMessage("loadingMsgText");

	return ok;
}

var lastDivName = "";

function ShowMessage(divName)
{
	if (lastDivName != "") {
		eval("frames['MainFrameArea'].document." + lastDivName + ".visibility = 'hidden';");
	}
	lastDivName = divName;
	eval("frames['MainFrameArea'].document." + lastDivName + ".visibility = 'visible';");
}

function UpdateProgressBar(doneAmt)
{
	frames['MainFrameArea'].document.progBarSync.setPercentDone(doneAmt);
}

function TriggerSync(reload, nextPage)
{
	window.message("TriggerSync called");
	if (top.gRequest.visitedHomeYet()) {
		frames['MainFrameArea'].document.location = "SyncMail.html?reload=" + reload + "&action=" + nextPage;
	} else {
		if (confirmPriv("Synching from TVWorld without visiting WebWorld first doesn't work yet. You shouldn't try this unless you're Scott Sanders. Do you want to connect anyway?",
				 top.gAlertIconURL, top.L_YesButton_Text, top.L_NoButton_Text)) {
			location = "client:syncofflineemail";
		}
	}

	return true;
}
