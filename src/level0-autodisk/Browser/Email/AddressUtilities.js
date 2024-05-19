// This file contains various JavaScript utility functions to support
// the email address verification.
// April 16, 1999
// Copyright 1999, WebTV Networks, Inc.

// Validates the syntax of an RFC822 sans comments
// I stole the algorithm from .../lib/mime/AddressUtils.c (server code)

var k822OK				= 1;
var k822BadNil			= 2;
var k822BadEmpty		= 3;
var k822BadSpace		= 4;
var k822BadLocalUser	= 5;
var k822BadRemoteUser	= 6;
var k822BadDomain		= 7;

// Temporary until we have our own help pages
var kExplainBadSpacesURL     = "wtv-guide:/part-Mail-Explain-Bad-Spaces";
var kExplainBadLocalUserURL  = "wtv-guide:/part-Mail-Explain-Bad-Local-User";
var kExplainBadRemoteUserURL = "wtv-guide:/part-Mail-Explain-Bad-Remote-User";
var kExplainBadDomainURL     = "wtv-guide:/part-Mail-Explain-Bad-Domain";
var kExplainUnknownDomainURL = "wtv-guide:/part-Mail-Explain-Unknown-Domain";
var kExplainDealerOnlyURL    = "wtv-guide:/part-Mail-Explain-Dealer-Only";


function IsRFC822SpecialChar(c)
{
	return "()<>@,;:\\\".[]".indexOf(c) != -1;
}

function isgraph(c)
{
	return (c != " ");
}

function CheckRFC822Syntax(address)
{
	if (address == "")
		return k822BadNil;

	// check for all spaces
	var len = address.length;
	var p = address;
	var i;

	// strip off leading spaces
	for (i = 0; i < len; i++)
		if (address.charAt(i) != " ") {
			p = address.substring(i);
			break;
		}
	
	if (i >= len)
		return k822BadEmpty;

 	var len = p.length;
	i = 0;

window.message("CheckRFC822Syntax1");

	var keepGoing = true;
//parse_word:
	while (keepGoing) {	// just to get rid of a goto statement
		keepGoing = false;

		if (p.charAt(i) == '"') {
			var foundAtsign = false;

			// quoted-text
			for (i = 1; i < len && p.charAt(i) != '"'; i++) {
				if (p.charAt(i) == '@')
					foundAtsign = true;
				else if (p.charAt(i) == '\\') {
					i++;
					if (i == len)
						break;
				}
			}
			if (i == len)
				return foundAtsign ? k822BadRemoteUser : k822BadLocalUser;

			// eat last '"'
			p = p.substring(i + 1);

		} else if (!IsRFC822SpecialChar(p.charAt(i))) {
			// atom
			for (i = 1; i < len && p.charAt(i) != " " && !IsRFC822SpecialChar(p.charAt(i)); i++);

		} else if (p.charAt(i) == '@' && p != address) {
			break;	// goto parse_domain;

		} else if (p.charAt(i) == " ") {
			return k822BadSpace;

		} else {
			return p.indexOf("@") != -1 ? k822BadRemoteUser : k822BadLocalUser;
		}

		for (; i < len && p.charAt(i) == ' '; i++)
			;

		if (p.charAt(i) == '.') {
			// Having two or more consequtive periods is against RFC822, but some
			// sites use broken addresses (eg. "s..patton@worldnet.att.net").

			while (p.charAt(i) == '.') {
				i++;
				while (i < len && p.charAt(i) == ' ')
					i++;
			}
			keepGoing = true; continue;	// goto parse_word;
		}
window.message("CheckRFC822Syntax1.5 p = ", p, " i = ", i, " len = ", len);
		if (i == len)
			return k822OK;
	}
 window.message("CheckRFC822Syntax2");
 //parse_domain:
	if (p.charAt(i) != '@') {
		if (i > 0 && p.charAt(i - 1) == " ")
			return k822BadSpace;
		else if (p.indexOf('@') != -1)
			return k822BadRemoteUser;
		else
			return k822BadLocalUser;
	}
	i++;

	while (i < len && p.charAt(i) == ' ')
		i++;

 window.message("CheckRFC822Syntax3 p = ", p, " i = ", i);
//parse_subdomain:
	keepGoing = true;
	while (keepGoing) {	// to get rid of a goto statement
 window.message("CheckRFC822Syntax3.01 p = ", p, " i = ", i);
		keepGoing = false;
 window.message("CheckRFC822Syntax3.02 p = ", p, " i = ", i);
		var c = p.charAt(i);
 window.message("CheckRFC822Syntax3.03 p = ", p, " i = ", i);

		if (i >= len || !isgraph(c) || IsRFC822SpecialChar(c))	// had check for !isgraph(*p) tht
			return k822BadDomain;

		i++;
 window.message("CheckRFC822Syntax3.1 p = ", p, " i = ", i);
		while (i < len && isgraph(p.charAt(i)) && !IsRFC822SpecialChar(p.charAt(i)))	// had check for isgraph(*p) tht
			i++;

 window.message("CheckRFC822Syntax3.2 p = ", p, " i = ", i);
		while (i < len && p.charAt(i) == ' ')
			i++;

 window.message("CheckRFC822Syntax3.3 p = ", p, " i = ", i);
		if (i < len && p.charAt(i) == '.') {
			i++;

 window.message("CheckRFC822Syntax3.4 p = ", p, " i = ", i);
			while (i < len && p.charAt(i) == ' ')
				i++;

			if (i < len) {
				keepGoing = true; continue; //goto parse_subdomain;
			}
		}
	}
window.message("CheckRFC822Syntax4 p = ", p, " i = ", i);
window.message(" len = ", len);
window.message("i = ", i);
window.message(" i < len ", i < len);
	if (i < len) {
window.message("CheckRFC822Syntax4 p != address ", p != address, " p.charAt(i - 1) = ", p.charAt(i - 1));
window.message("p != address && p.charAt(i - 1) == ' ' ", p != address && p.charAt(i - 1) == ' ');
		if (p != address && p.charAt(i - 1) == ' ')
			return k822BadSpace;
		else
			return k822BadDomain;
	}

	return k822OK;
}

function IsTopLevelDomain(domain)
{
	if (domain == "")
		return false;

	// There are so many two letter country domains that it isn't worth
	// trying to validate them.
	if (domain.length == 2)
		return true;

	return domain == "com"
		|| domain == "edu"
		|| domain == "gov"
		|| domain == "int"
		|| domain == "mil"
		|| domain == "net"
		|| domain == "org"
		|| domain == "arpa";
}

// I heisted this routine from MailValidate.c in the server and
// converted it to JavaScript - tht 4/16/99

function ValidateAddresses(addresses)	// parameters in: pass in a list of comma-separated addresses
										// result: returns "" on no-error or an error string on error
{
	var addressList = addresses.split(",");
	var count = addressList.length;
	var explanationURL = "";
	var fullAddress = "";

//addressLoop:
	for (var i = 0; i < count; i++) {
		fullAddress = addressList[i];

		var addr = fullAddress;	// tht haven't implemented yet addr = UncommentedAddress(fullAddress);

// tht - there's not a good way that I know of to check for ascii and control characters in JS
//		for (var j = 0; j < addr.length; j++) {
//			if (!isascii(*p) || iscntrl(*p) ||
//				((p == addr || isspace(p[-1])) && IsPrefix(p, "=?"))) {
//				explanationURL =
//					strchr(addr, '@') == nil ?
//						kExplainBadLocalUserURL : kExplainBadRemoteUserURL;
//				goto bail;
//			}
//		}

		var syntaxResult = CheckRFC822Syntax(addr);
window.message("CheckRFC822Syntax = ", syntaxResult);
		if (syntaxResult == k822OK)
			; // good result
		else if (syntaxResult == k822BadSpace) {
			explanationURL = kExplainBadSpacesURL;
			break; // addressLoop;
		} else if (syntaxResult == k822BadLocalUser) {
			// We can't check local users when not connected   explanationURL = kExplainBadLocalUserURL;
			//break; // addressLoop;
		} else if (syntaxResult == k822BadRemoteUser) {
			explanationURL = kExplainBadRemoteUserURL;
			break; // addressLoop;
		} else if (syntaxResult == k822BadDomain) {
			explanationURL = kExplainBadDomainURL;
			break; // addressLoop;
		} else if (syntaxResult == k822BadEmpty || syntaxResult == k822BadNil) {
		  	explanationURL = kExplainBadRemoteUserURL;
			break; // addressLoop;
		}

		// Find the domain
		// at = strchr(addr, '@');
		{
			var inQuotedString = false;
			var at = addr;
			for (var k = 0; k < addr.length; k++) {
				if (!inQuotedString && addr.charAt(k) == '@') {
					break;
				} else if (addr.charAt(k) == '"') {
					inQuotedString = !inQuotedString;
				} else if (addr.charAt(k) == '\\' && addr.length > 0) {
					k++;
				}
			}

			if (k >= addr.length - 1)
				at = "";

			/* Would be taken care of above if we hadn't disabled it */
			if (inQuotedString) {
				explanationURL = addr.indexOf('@') == -1 ?
					kExplainBadLocalUserURL : kExplainBadRemoteUserURL;
				break; // addressLoop;
			}
		}

		if (at == "") {
			// the block of code here used to check for valid local addresses.
			// We don't have a way to do that offline
		} else {
			var badTopLevelDomain = false;
			var atCopy = at;

			// Nuke any trailing space and dot
			for (var p = atCopy.length; 
				 p > 0 && (atCopy.charAt(p - 1) == " " || atCopy.charAt(p - 1) == '.'); p--);
			atCopy = atCopy.substring(0, p);

			// Find the last (top level) domain
			p = atCopy.lastIndexOf(".");
			if (p <= 0)
				badTopLevelDomain = true;
			else {
				lastDomain = atCopy.substring(p + 1);
				if (!IsTopLevelDomain(lastDomain)) {
					badTopLevelDomain = true;
				}
			}
			if (badTopLevelDomain) {
				explanationURL = kExplainUnknownDomainURL;
				break; // addressLoop;
			}
		}
	}
	var addressOK = explanationURL == "";
	window.message("addressOK = ", addressOK, " explanationURL = ", explanationURL);
	if (!addressOK) {
		var errorMsg;
		if (explanationURL == kExplainBadSpacesURL) {
			var L_SpacesInAddress_Text = "There should be no spaces in a person's mail address.\n\nMake sure you are only typing mail addresses in the To field.";
			errorMsg = L_SpacesInAddress_Text;
		} else {
			var L_BadAddress_Text = "The address you typed - &1 - appears to be misspelled.\n\nPlease check the address and try again.";
			errorMsg = ParamText(L_BadAddress_Text, fullAddress);
		}
		var L_Explain_Text = "Explain";
		if (!confirmPriv(errorMsg, top.gAlertIconURL, top.L_Continue_Text, L_Explain_Text)) {
			// tell user more about the error
			var newLoc = "EmailWarning.html?nextpage=current&error=" + explanationURL + "&button=continue";
			frames['MainFrameArea'].document.location = newLoc;
		}
	}
	return addressOK;
}
