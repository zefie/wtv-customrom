// This file contains various JavaScript utility functions to support
// the offline email application.
// March 15, 1999
// Copyright 1999, WebTV Networks, Inc.

function IsWebTV()
{
	var userAgent=navigator.appName + " " + navigator.appVersion;
	var agentInfo=userAgent.substring(0, 5);

	return agentInfo == "WebTV";
}

function clientVersion()
{
	var raw = navigator.appVersion;
	// form is "3.0 (WebTV;x.y)"; return x.y as number
	var resultStr = raw.substring(raw.indexOf("(WebTV;") + 7, raw.indexOf(")"));
	return parseFloat(resultStr);
}

function XMLBuiltIn()
{
	// returns true for 2.x, false for 3.0
	return clientVersion() < 3;
}

function NewXMLDocument()
{
	if (XMLBuiltIn()) {
		return new XMLDocument;
	} else {
		return new ActiveXObject("clsid:00004414-0C8A-11d2-BEEF-00A0C9AA0831");
	}
}

function newStore(path)
{
	if (XMLBuiltIn()) {
		return new Store(path);
	} else {
		return new document.Store(path);
	}
}
function newRequest() {
	if (XMLBuiltIn()) {
		return new Request;
	} else {
		return new document.Request("");
	}
}

function beginSidebars(enableWebTVLogo)
{
	var sideBarText;

	sideBarText	=	"<sidebar><table absheight=80 cellspacing=0 cellpadding=0 width=100% bgcolor=514971>";
	sideBarText	+=		"<tr>";

	if (enableWebTVLogo) {
		sideBarText	+=			'<td abswidth=6>';
		sideBarText	+=			'<td abswidth=93 absheight=76>';
		sideBarText	+=			'<table href="client:gototvhome" absheight=76 cellspacing=0 cellpadding=0 width=100%>';
		sideBarText	+=			'<tr>';
		sideBarText	+=			'<td align=center>';
		sideBarText	+=			'<img src="file://ROM/Cache/WebTVLogoJewel.gif" width=87 height=67>';
		sideBarText	+=			'</table>';

	} else {
		sideBarText	+=			'<td valign=middle align=center td width=104 height=80 >';
		sideBarText	+=				"<img src=\"file://ROM/Cache/WebTVLogoJewel.gif\" width=87 height=67></td>";
	}
	sideBarText	+=		"</tr>";
	sideBarText	+=	"</table>";

	frames['MainFrameArea'].document.write(sideBarText);
	frames['MainFrameArea'].document.write( "<table cellspacing=0 cellpadding=0>" );
}

function addSidebar( text, link, id, javaScriptTarget, enabled )
{
	var sideBarText;

	sideBarText =	"<tr><td width=104 height=2 bgcolor=000000 transparency=60><spacer></td>";
	sideBarText +=	"<tr><td width=104 height=1></td>";
	sideBarText +=	"<tr><td width=104 height=2 bgcolor=ffffff transparency=84><spacer></td>";
	sideBarText +=	"<tr><td height=26>";
	sideBarText +=		"<table cellspacing=0 cellpadding=0>";
	sideBarText +=			"<tr><td abswidth=8 height=26>";
	sideBarText +=				"<td abswidth=105>";
	sideBarText +=					"<table target=" + id + " abswidth=86 cellspacing=0 cellpadding=0"

	if (enabled) {
		// In order to make the browser's selection of a button fill the whole button space, there must
		// be an href, even if it is a <SP>
		if (link == "")
			link = " ";
		sideBarText +=						 " href=\"" + link + '" ';
		if (javaScriptTarget != "")
			sideBarText +=						" " + javaScriptTarget;
	}
	sideBarText +=							" >";
	sideBarText +=						"<tr><td absheight=1>";
	sideBarText +=						"<tr><td><spacer width=9 type=block>";
	var fontColor = enabled ? "ffcf69" : "515b84";
	sideBarText +=							"<shadow><font color=" + fontColor + ">" + text + "</font></shadow>";
	sideBarText +=					"</table>";
	sideBarText +=		"</table>";

	frames['MainFrameArea'].document.write(sideBarText);
}

function endSidebars()
{
	var sideBarText;

	sideBarText =	"<tr><td width=104 height=2 bgcolor=000000 transparency=60><spacer></td>";
	sideBarText +=	"<tr><td width=104 height=1></td>";
	sideBarText +=	"<tr><td width=104 height=2 bgcolor=ffffff transparency=84><spacer></td>";
	sideBarText +=	"</table></sidebar>";

	frames['MainFrameArea'].document.write(sideBarText);
}

function GetXMLLetter(letterIndex, folder)
{
	var letter = "";
	if (letterIndex < folder.length && letterIndex >= 0) {
		var letterStore = folder[letterIndex];
		var letterUrl = letterStore.location;
		if (xmldoc.load(letterUrl)) {
			var letters = xmldoc.getElementsByTagName("letter");
			letter = letters[0];
		} else {
			window.message("GetXMLLetter - couldn't load ", letterUrl);
		}
	}
	return letter;
}

function IsLetterDeleted(letterIndex)	// assumes InBox letter only
{
	var deleted = false;
	if (letterIndex < gInFolderStore.length && letterIndex >= 0) {
		var letter = GetXMLLetter(letterIndex, gInFolderStore);

		if (letter != "")
			deleted = letter.getAttribute("deleted") == "y";
	}
	return deleted;
}

function FixFilenameForXMLWriting(filename)
{
	return FixFilename(filename, "file://");
}

function FixFilenameForStoreWriting(filename)
{
	return FixFilename(filename, "file://disk");
}

function FixFilename(filename, prefix)
{
	var strippedFilename = filename;
	if (filename.substring(0, prefix.length) == prefix)
		strippedFilename = filename.substring(prefix.length);	// strip off prefix

	//window.message("@@@@@@@@@@ FixFilename turned ", filename, " into ", strippedFilename);
	return strippedFilename;
}

function IsLetterRead(letterIndex)	// assumes InBox letter only
{
	var hasRead = false;
	if (letterIndex < gInFolderStore.length && letterIndex >= 0) {
		var letter = GetXMLLetter(letterIndex, gInFolderStore);

		if (letter != "")
			hasRead = letter.getAttribute("hasRead") == "r" && letter.getAttribute("deleted") != "y";
	}
	return hasRead;
}


function MarkLetterRead(letterIndex, folder)
{
	var letter = top.MailFolder_GetLetter(folder, letterIndex);

	if (letter != "" && letter.getAttribute("hasRead") != "r") {
		letter.setAttribute("hasRead", "r");
		top.MailFolder_SaveLetter(folder, letterIndex);
	}
}

function FindAddress(nickName)	// given a nickname, return the corresponding address, or ""
{
	if (gAddressEntries.length != null) {
		for (var i = 0; i < gAddressEntries.length; i++) {
			var addressAndShortcut = gAddressEntries[i];
			name = addressAndShortcut.getAttribute("s");
			if (name == nickName) {
				return addressAndShortcut.getAttribute("a");
			}
		}
	}
	return "";
}

function RemoveAddress(nickName)	// given a nickname, delete the corresponding node
{
window.message("Removing ", nickName, " entry count ", gAddressEntries.length);
	if (gAddressEntries.length != null) {
		var changed = false;
		for (var i = 0; i < top.gAddressEntries.length; i++) {
			var addressAndShortcut = top.gAddressEntries[i];
			name = addressAndShortcut.getAttribute("s");
			if (name == nickName) {
				var addresses = top.gAddressBookXML.getElementsByTagName("AddressBook");
				var xmlnode = addresses[0];
				xmlnode.removeChild(addressAndShortcut);
				changed = true;

				// notice that we don't do a "break" here and continue all the
				// way through the list. This will take care of deleting any
				// duplicates in the list.
			}
		}
		if (changed) {
			var addresses = top.gAddressBookXML.getElementsByTagName("AddressBook");
			var address = addresses[0];
			address.setAttribute("changed", true)
		}
	}
}

function AddAddressToBook(newNickname, newAddress, oldNickname)
{
	if (newNickname == '' && newAddress == '')
		return;

	var warning = '';
	if (newNickname == '') {
			var newLoc = "EmailWarning.html?nextpage=CleanUpMail.html&error=OutBoxFull&button=cleanup";
			window.message("AddAddressToBook going to: ", newLoc);
			frames['MainFrameArea'].document.location = newLoc;
//		var newLoc = "EmailWarning.html?nextpage=current&error=AddressName";
//		window.message("ERROR: ", newLoc);
//		location = newLoc;
		return false;
	} else if (newAddress == '')
		warning = "Please specify an e-mail address."

	if (oldNickname == "" && warning == '') {
		var foundAddress = FindAddress(newNickname);
		if (foundAddress != '') {
			var L_ReplaceNickname_Text = 'The name "&1" already exists in your address list.\n\nWould you like to replace it?';
			var L_ReplaceButton_Text = "Replace it";
			var L_DontReplaceButton_Text = "Don't replace it";

			var confirmMsg = ParamText(L_ReplaceNickname_Text, newNickname);
			if (!confirmPriv(confirmMsg, top.gAlertIconURL, L_ReplaceButton_Text, L_DontReplaceButton_Text))
				return false;
		}
	}
	if (warning != '') {
		alert(warning);
		return false;
	}
window.message("about to validate");

	if (ValidateAddresses(newAddress)) {
		if (oldNickname != "")
			RemoveAddress(oldNickname);	// delete the old nickname
		RemoveAddress(newNickname);

		// add a new address element to the address book
		var addresses = top.gAddressBookXML.getElementsByTagName("AddressBook");
		var xmlnode = addresses[0];
		var al = top.gAddressBookXML.createAttributeList();
		al.setAttribute(top.gAddressBookXML.createAttribute("s", newNickname));
		al.setAttribute(top.gAddressBookXML.createAttribute("a", newAddress));
		var e = top.gAddressBookXML.createElement("ae", al);

		if (gAddressEntries.length != null) {
			// add the new node is a sorted position in the list
			for (var i = 0; i < gAddressEntries.length; i++) {
				var addressAndShortcut = gAddressEntries[i];
				name = addressAndShortcut.getAttribute("s");
				if (newNickname < name)
					break;
			}
			if (i < gAddressEntries.length)
				xmlnode.insertBefore(e, gAddressEntries[i]);
			else
				xmlnode.appendChild(e);
		} else
			xmlnode.appendChild(e);

		xmlnode.setAttribute("changed", true);

		// write the address book back out
	window.message("Writing address book to ", top.gPath.AdrBookFile);
		top.gAddressBookXML.toXML(top.gPath.AdrBookFile);
		LoadAddressBook();	// reload to reflect changes
	}
	return true;
}

function LoadAddressBook()
{
	window.message("Loading address book ", top.gPath.AdrBookFile);
	if (top.gAddressBookXML.load("file://" + top.gPath.AdrBookFile)) {
		gAddressEntries = top.gAddressBookXML.getElementsByTagName("ae");
		return true;
	} else {
		window.message("LoadAddressBook - couldn't load ", top.gPath.AdrBookFile);
		return false;
	}
}

function ParamText(s)	// s = string with replacement parameters. Even though extra parameters aren't
						// shown in this function, they're passed in. An example string:
						// "You have &1 new messages."
						// Warning: this function doesn't support any special kind of quoting!
{
	for (var i = 1; i < arguments.length; i++ ) {
		var param = "&" + i;
		var index = s.indexOf(param);
		if (index >= 0) {
			//window.message("i = ", i, " param = ", param, " index = ", index, " part1 = \"", s.substring(0, index),
			//	"\" part2 = \"", s.substring(index + param.length), '"');

			s = s.substring(0, index) + arguments[i] + s.substring(index + param.length);
		}
	}
	return s;
}

function ConvertDate(d)	// give a date string (I might convert this to a date object), return
						// a shortened string with just the month and day
{
	// ************** WARNING : this function needs to be converted to do its work in
	// a locale-independent manner

	var badLoc = d.indexOf("<");	// strip off the <font> and <fontsize> junk the server appends to the date
	if (badLoc >= 0)
		d = d.substring(0, badLoc);

window.message("initial date ", d);
	var dd = new Date(d);
window.message("converted date = ", dd.toString());
	var localeDate = dd.toLocaleString();
	var delim = XMLBuiltIn() ? " " : "/";
	var firstIndex = localeDate.indexOf(delim);
	var secondIndex = localeDate.indexOf(delim, firstIndex + 1);

	localeDate = localeDate.substring(0, secondIndex);

window.message("&*&**& delim '", delim, "' firstIndex ", firstIndex, " secondIndex ", secondIndex,
		" localeDate ", localeDate);
	return localeDate;
}

function CleanUp()	// called when exiting this page (i.e. leaving offline email)
{
	top.SaveUserAttributes();
}

function SaveUserAttributes()
{
	// Save any changes to user info
	window.message("Writing user attrs to ", top.gPath.UserInfoFile);

	//top.gUserInfoXML.toXML(top.gPath.UserInfoFile);
}

function SaveConfigAttributes()
{
	// Save any changes to global configuration file
	window.message("Writing global attrs to ", top.gPath.ConfigFile);

	top.gConfigXML.toXML(top.gPath.ConfigFile);
}

function CalcInBox()
{
	var messageCnt = top.MailFolder_length(top.gInFolder);
	top.gFullInBox = messageCnt >= top.gConfig.MaxInMsgs;
	window.message("messageCnt " + messageCnt + " top.gConfig.MaxInMsgs " + top.gConfig.MaxInMsgs + " gFullInBox " + gFullInBox);
}

function CalcOutBox()
{
	var messageCnt = top.MailFolder_length(top.gOutFolder);
	top.gFullOutBox = messageCnt >= top.gConfig.MaxOutMsgs;
	window.message("messageCnt " + messageCnt + " gMaxOutMsgs " + top.gConfig.MaxOutMsgs + " gFullOutBox " + gFullOutBox);
}

function CalcFolderSizes()
{
	CalcInBox();
	CalcOutBox();
}

function GetLocalUserIndex(uid)
{
	var len = top.gUserInfos.length;
	for (var i = 0; i < len; i++) {
		if (uid == top.gUserInfos[i].getAttribute("UserID"))
			return i;
	}

	return -1;
}

function GetServiceUserIndex(uid)
{
	for (var i = 0; i < top.gServiceUserCount; i++) {
		var user = top.gServiceUserInfos[i];
		var userID = user.getAttribute("userid");
		if (uid == userID)
			return i;
	}

	return -1;
}

function AddOrDeleteUserFiles(addem, userID, userName)
{
	// Create or delete a blank address book in the user's new folder
	var addrFile = top.gPath.AdrBookFilename + userName + ".xml";
	var addrFileStore;
	var writeFile = top.gPath.LastMsgFilename + userID + ".xml";
	var writeFileStore;

	var s = addem ? "creating":"deleting";
	window.message(s + " addr book at ", addrFile);
	window.message(s + " last msg at ", writeFile);

	var inFolderDir = top.gPath.InBoxDir + userID + "/";
	var outFolderDir = top.gPath.OutBoxDir + userID + "/";

	window.message(s + " infolder ", inFolderDir);
	window.message(s + " outfolder ", outFolderDir);

	var inFolder;
	var outFolder;

	if (top.XMLBuiltIn()) {
		inFolder = new Store(inFolderDir);
		outFolder = new Store(outFolderDir);
		addrFileStore = new Store(addrFile);
		writeFileStore = new Store(writeFile);
	} else {
		inFolder = new document.Store(inFolderDir);
		outFolder = new document.Store(outFolderDir);
		addrFileStore = new document.Store(addrFile);
		writeFileStore = new document.Store(writeFile);
	}
	// Tricky note here: setting the data of a Store object to "" actually
	// deletes the file!
	// Create a blank "write" message where we keep track of user's last
	// incomplete message before a send.

	if (addem) {
		// if the address book already exists, don't write over it. This can happen when the user
		// originally logs into Web World and the address book gets created there before we get
		// a chance to create a corresponding offline email user.
		if (addrFileStore.parent.length == 0)
			addrFileStore.data = '<AddressBook changed="true"></AddressBook>';
		writeFileStore.data = "<letter><sender_address></sender_address><cc></cc><subject></subject><message></message></letter>";
	} else {
		addrFileStore.data = "";
		writeFileStore.data = "";

		// delete the folders
		inFolder.data = "";
		outFolder.data  = "";
	}
}

function AddUser(user)
{
	var userName = user.getAttribute("user-name");
	var userID = user.getAttribute("userid");

	window.message("AddUser ", userName);

	// create attributes
	var al = top.gUserInfoXML.createAttributeList();

	// now set all the attributes
	var name = user.getAttribute("first-name");
	if (name != "")
		name += " ";
	name += user.getAttribute("last-name");
	al.setAttribute(top.gUserInfoXML.createAttribute("UserName", name));
	al.setAttribute(top.gUserInfoXML.createAttribute("UserID", userID));
	al.setAttribute(top.gUserInfoXML.createAttribute("EmailAddress", userName));
	al.setAttribute(top.gUserInfoXML.createAttribute("Password", user.getAttribute("password")));
	al.setAttribute(top.gUserInfoXML.createAttribute("BadLogin", ""));
	al.setAttribute(top.gUserInfoXML.createAttribute("BadLoginCnt", "0"));
	al.setAttribute(top.gUserInfoXML.createAttribute("BadConnect", false));
	al.setAttribute(top.gUserInfoXML.createAttribute("LastID", "0"));
	al.setAttribute(top.gUserInfoXML.createAttribute("UnsentUnreadCnt", "0"));
	al.setAttribute(top.gUserInfoXML.createAttribute("UnsentReadCnt", "0"));
	al.setAttribute(top.gUserInfoXML.createAttribute("ListOrder", "D"));	// A = ascending D = descending
	al.setAttribute(top.gUserInfoXML.createAttribute("Storage", false));
	al.setAttribute(top.gUserInfoXML.createAttribute("CC", false));
	al.setAttribute(top.gUserInfoXML.createAttribute("Reply", false));

	// create a new node with the attributes
	var e = top.gUserInfoXML.createElement("UserInfo", al);

	// Add the new user node to the current list of users
	var usersBlock = top.gUserInfoXML.getElementsByTagName("Users");
	var users = usersBlock[0];
	users.appendChild(e);

	top.AddOrDeleteUserFiles(true, userID, userName);
}

function DeleteUser(userIndex)
{
	window.message("DeleteUser # ", userIndex);

	// delete xml node
	var userInfo = top.gUserInfos[userIndex];

	// delete msg folders
	top.AddOrDeleteUserFiles(false, userInfo.getAttribute("UserID"), userInfo.getAttribute("EmailAddress"));

	// Remove the old node from the current list of users
	var usersBlock = top.gUserInfoXML.getElementsByTagName("Users");
	var users = usersBlock[0];
	users.removeChild(userInfo);
}

function VerifyUser(user, userIndex)
{
	// See if the user's name, password, etc. has changed
	var changed = false;

	var userInfo = top.gUserInfos[userIndex];

	if (user.getAttribute("mail-enabled") != "true") {
		// an existing user has been disabled. Delete the user from our list
		top.DeleteUser(userIndex);
		changed = true;
	} else {
		var userName = user.getAttribute("first-name");
		if (userName != "")
			userName += " ";
		userName += user.getAttribute("last-name");
		window.message ("UserName ", userName);
		if (userInfo.getAttribute("UserName") != userName) {
			userInfo.setAttribute("UserName", userName);
			changed = true;
		}
		var addr = user.getAttribute("user-name");
		window.message ("EmailAddress ", userInfo.getAttribute("EmailAddress"), " ", addr);
		if (userInfo.getAttribute("EmailAddress") != addr) {
			userInfo.setAttribute("EmailAddress", addr);
			changed = true;
		}
		var password = user.getAttribute("password");
		window.message ("Password ", userInfo.getAttribute("Password"), " ", password);
		if (userInfo.getAttribute("Password") != password) {
			userInfo.setAttribute("Password", password);
			changed = true;
		}
	}
	return changed;
}

function SyncUsers()
{
	// go through the list of users and synchronize our list to it
	window.message("SyncUsers - there are ", top.gServiceUserCount, " users");

	var changed = false;

	if (top.gServiceUserCount == 0) {
		window.message("*****There are no users on this box!");
	}
	for (var i = 0; i < top.gServiceUserCount; i++) {
		var user = top.gServiceUserInfos[i];
		var userID = user.getAttribute("userid");

		// see if we already know about this user
		var userIndex = top.GetLocalUserIndex(userID);
		if (userIndex < 0) {
			// new user - add 'em if they are enabled to use email
			if (user.getAttribute("mail-enabled") == "true") {
				top.AddUser(user);
				changed = true;
			}
		} else if (VerifyUser(user, userIndex))	// see if user info has changed
			changed = true;
	}

	// Now go through our user list and see if we have any users that
	// the service doesn't know about. If we do, delete them.

	var userLength = top.gUserInfos.length;
window.message("Now going to delete max = ", userLength);
	for (i = 0; i < userLength; i++) {
		var userInfo = top.gUserInfos[i];
		var uid = userInfo.getAttribute("UserID");
		var userIndex = top.GetServiceUserIndex(uid);
		if (userIndex < 0) {
			// deleted user - wipe 'em out
			top.DeleteUser(i);
			changed = true;
			if (top.gUserInfos.length < userLength)
				--i;	// we removed a node in the middle of iterating, back up one
		}
	}
	if (changed) {
		// save user config file
		top.SaveUserAttributes();
		top.gUserInfos = top.gUserInfoXML.getElementsByTagName("UserInfo");
		top.gUserCount = top.gUserInfos.length;
	}
}

function OpenFolder(id, incoming)
{
	var folderDir = incoming ? top.gPath.InBoxDir : top.gPath.OutBoxDir;
	folderDir += id;

	window.message("Opening folder ", folderDir);

	if (top.XMLBuiltIn()) {
		folder = new Store(folderDir);
	} else {
		folder = new document.Store(folderDir);
	}
	return folder;
}

function OpenOutFolder(id)
{
	return OpenFolder(id, false);
}

function OpenInFolder(id)
{
	return OpenFolder(id, true);
}

function refreshArrows()
{
	if(frames['MainFrameArea'].document.scrollingListArea.isScrollBottom())
		frames['MainFrameArea'].document.downArrow.visibility = "hidden";
	else
		frames['MainFrameArea'].document.downArrow.visibility = "visible";

	if(frames['MainFrameArea'].document.scrollingListArea.isScrollTop())
		frames['MainFrameArea'].document.upArrow.visibility = "hidden";
	else
		frames['MainFrameArea'].document.upArrow.visibility = "visible";
}

function ChooseUser(user)
{
	window.message("new ChooseUser user choosen ", user);

	top.gCurrentUser	= user;
	top.gUserInfo		= top.gUserInfos[user];
	top.gEmailAddress	= top.gUserInfo.getAttribute("EmailAddress");
	top.gUserName		= top.gUserInfo.getAttribute("UserName");
	top.gUserID			= top.gUserInfo.getAttribute("UserID");
	top.gUserPasswd		= top.gUserInfo.getAttribute("Password");
	top.gBadLogin		= top.gUserInfo.getAttribute("BadLogin") != "";
	top.gBadLoginCnt	= top.gUserInfo.getAttribute("BadLoginCnt");
	top.gBadConnect		= top.gUserInfo.getAttribute("BadConnect") == "true";
	top.gListAscending	= top.gUserInfo.getAttribute("Storage") == "true";
	top.gExtraStorage	= top.gUserInfo.getAttribute("ListOrder") == "true";
	top.gReplyIncludeMsg= top.gUserInfo.getAttribute("Reply") == "true";
	top.gCCMsg			= top.gUserInfo.getAttribute("CC") == "true";
}

function LoadUserFolders()
{
	// Open message folders			
	window.message("LoadUserFolders creating stores");

	top.gInFolderStore = top.OpenInFolder(top.gUserID);
	top.gOutFolderStore = top.OpenOutFolder(top.gUserID);

	top.gInFolder		= new top.MailFolder("InBox", top.gListAscending);
	top.gOutFolder		= new top.MailFolder("OutBox", top.gListAscending);
	top.gDeletedFolder	= new top.MailFolder("Deleted", top.gListAscending);

	top.LoadAllFolders();

	// load the address book
	top.gPath.AdrBookFile = top.L_Disk_FileName + top.gPath.AdrBookFilename + top.gEmailAddress + ".xml";
	top.LoadAddressBook();

	top.gPath.LastMsgFile = top.L_Disk_FileName + top.gPath.LastMsgFilename + top.gUserID + ".xml";
}

function VerifyFile(path, initialData)
{
	// This function will verify that a file exists. If it doesn't exist, the
	// file will be created with the data "initialData".

	// strip "Disk" off of front since the Store object assumes disk as the root
	if (path.indexOf(L_Disk_FileName) == 0)
		path = path.substring(L_Disk_FileName.length + 1);
	var s;
	if (top.XMLBuiltIn()) {
		s = new Store(path);
	} else {
		s = new document.Store(path);
	}
	if (s.parent.length == 0) {
		// write out an initial file
		s.data = initialData;
		window.message("* * * * * VerifyFile created file ", path);

		// If we ever have to create a file we expect to be there, assume that the box
		// lost its mind. That way, the next time we sync, the service will send us
		// everything.
		top.gBoxLostMind = true;
	} else
		window.message("* * * * * VerifyFile opened existing file ", path);
}

function WarnUser()
{
	// This function never returns. It either goes to a page warning the user of errors,
	// or goes directly to the list mail page.

	top.LoadUserFolders();

	top.gFullInBox = false;
	top.gFullOutBox = false;

	top.CalcFolderSizes();

	var frameStr;
	var frameParms = "";

	if (gFullInBox) {
		if (frameParms != "")
			frameParms += ",";
		frameParms += "InBoxFull";
	}

	if (gFullOutBox) {
		if (frameParms != "")
			frameParms += ",";
		frameParms += "OutBoxFull";
	}
	
	if (gBadConnect) {
		if (frameParms != "")
			frameParms += ",";
		frameParms += "CantConnect";
	}

	if (frameParms != "")
		frameStr = "EmailWarning.html?nextpage=ListMail.html&error=" + frameParms;
	else
		frameStr = "ListMail.html";

	window.message("going to " + frameStr);
	top.frames[0].location = frameStr;
	return true;
}

