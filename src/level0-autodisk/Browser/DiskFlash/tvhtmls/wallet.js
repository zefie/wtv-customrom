function IsPosInt(numstring) {
	var i;
	if (numstring == "")
		return false;
	for (i=0; i < numstring.length; i++)
		if (numstring.charAt(i) < '0' || numstring.charAt(i) > '9')
			return false;
	return true;
}
function TrimWhiteSpace(string) {
  var i = 0;
  while( i < string.length && string.charAt(i) == " ")
    i++;
  if (i == string.length)
    return "";
  var restOfString = string.substring(i, string.length);
  i = restOfString.length - 1;
  while( i >= 0 && restOfString.charAt(i) == " ")
    i--;
  return restOfString.substring(0, i+1);
}
function ValidZip(zip,country) {
  var validChars = "1234567890-";
  var hyphenCount = 0;
  if (zip == "") { return false; }
  country = country.toLowerCase();
  if (country == "usa" || country == "us") {
	if ((zip.length == 5) || (zip.length == 10))
	{
		for (i=0; i < zip.length; i++) {
			var charCheck = zip.charAt(i);
			if (charCheck == "-")	hyphenCount++;
			if (validChars.indexOf(charCheck,0) == -1) {return false; }
			if ((hyphenCount > 1) || ((zip.length==10) && ""+zip.charAt(5)!="-")) return false;
		}
			return true;
	} else
		return false;
  } else {
    if (zip.length ==7) { 
		 for (i=0; i < zip.length; i++) {
			var charCheck = zip.charAt(i);
			if (( i == 0) || (i == 2) || ( i==5)){
				if (isAlpha(charCheck) == false) { return false; }
			}else if (( i == 1) || (i == 4) || ( i==6)){
				if (isNaN(parseInt(charCheck,10)) == true) { return false; }
			}else {
				  if (charCheck != " ")	return false;				  
		    }	
		}			
		  return true;
	}else
		return false;
  }
}
function ValidPIN(PIN1, PIN2) {
  var validChars = "1234567890";
  if (PIN1.length != 4 )
		return false;
  if (PIN1 != PIN2) { return false; }
  if (PIN1 == "") { return false; }
  for (i=0; i<PIN1.length; i++) {
    charCheck = PIN1.charAt(i);
    if (validChars.indexOf(charCheck,0) == -1) { return false; }
  }
  return true;
}
function StripDashesAndSpaces( ccString ) {
  var result = "";
  for (var i=0; i < ccString.length; i++) {
    var charTest = ccString.charAt(i);
    if (charTest != " " && charTest != "-" && charTest != ".") {
      result += charTest;
	}
  }
  return result;
}
function isValidCardNum(strCreditCardNum) {
	if (strCreditCardNum.length != 13 && strCreditCardNum.length  != 16)
		return false;
	sum = 0; mul = 1; slen = strCreditCardNum.length;
	for (i = 0; i < slen; i++)
	{
		digit = strCreditCardNum.charAt(slen-i-1);
		if ( digit < '0' || digit > '9' )
			return false;
		tproduct = parseInt(digit,10)*mul;
		if (tproduct >= 10)
			sum += (tproduct % 10) + 1;
		else
			sum += tproduct;
		if (mul == 1)
			mul++;
		else
			mul--;
	}
	if ((sum % 10) == 0)
		return (true);
	else
		return (false);
}
function IsDateOK( monthString, yearString ) {
   if (!IsPosInt(monthString)) 
	return false;
   if (!IsPosInt(yearString))
	return false;
  if (parseInt(monthString,10) < 1 || parseInt(monthString,10) > 12) {
	return false;
  }
	var now = new Date();
	var yearNow = now.getFullYear();
	var monthNow = now.getMonth() + 1;
	var monthToCompare = parseInt(monthString, 10);
  var yearToCompare = parseInt(yearString, 10);
	if  (yearToCompare > yearNow)
			return true;
	else if (yearToCompare < yearNow)
			return false;
	else if (monthToCompare > monthNow)
			return true;
	return false;
}
function CheckCreditCardLengthAndPrefix( ccNumString )
{
	if (ccNumString.length == 16)
	{
		if (ccNumString.charAt(0) == "4")
			return true;
		var prefixNum = parseInt(ccNumString.substring(0,2),10);
		if (prefixNum >= 51 && prefixNum <= 55)
			return true;
		return false;
	}
	if (ccNumString.length == 13)
	{
		if (ccNumString.charAt(0) == "4")
			return true;
	}
	return false;
}
function ValidPhone(phone) {
	var validChars = "1234567890";
	if(phone == "") { return false; }
		if (phone.length != 10) { return false; }
	for (i=0; i < phone.length; i++) {
		charCheck = phone.charAt(i);
		if (validChars.indexOf(charCheck,0) == -1) { return false; }
	}
	return true;
}
function ValidEMail(email) {
	var invalidChars = " /,;()<>:\\\"[]~`#$^&*={}|\'?";
	if (email == "") { return false; }
	for (i=0; i < invalidChars.length; i++) {
		badChar = invalidChars.charAt(i);
		if (email.indexOf(badChar,0) > -1) { return false; }
	}
	atPos = email.indexOf("@",1);
	if (atPos == -1) { return false; }
	if (email.indexOf("@",atPos+1) != -1) { return false; }
	periodPos = email.indexOf(".", atPos);
	if (periodPos == -1 ) { return false; }
	if (periodPos +3 > email.length) { return false; }
	return true;
}
function XOutCCNum( ccString )
{
  var result = "";
  var startRevealIndex = ccString.length - 4;
  for (var i=0; i < ccString.length; i++) {
    if (i < startRevealIndex)
      result += "x";
    else
      result += ccString.charAt(i);
  }
  return result;
}
function blastCardInfo(){
  top.ccExpMonth = "";
  top.ccExpYear = "";
  top.ccNum = "";
  top.myWallet.setUserInfo("ccNum","");
  top.myWallet.setUserInfo("ccExpMonth","");
  top.myWallet.setUserInfo("ccExpYear","");
  top.goToReview = false;
  top.SetPage('card_pin.html');
}
function validateYear(year) {
	var yearnum;
	year.value = TrimWhiteSpace(year.value);
	if (!IsPosInt(year.value))
		return "";
	yearnum = parseInt(year.value,10);
	if ( (year.value.length == 2)|| (year.value.length == 1) )
		yearnum += 2000;
	var today = new Date();
	if (yearnum < today.getFullYear() || yearnum < 2000 || yearnum > 2099)
		return "";
	else
		return yearnum;
}
function isAlpha(ch)
{
	var validAlpha="abcdefghijklmnopqrstuvwxyz";
	var tempAlpha = ch.toLowerCase();
	if (validAlpha.indexOf(tempAlpha,0) == -1) return false; 
	return true;
}
function isValid(ch)
{
	var validAlpha="abcdefghijklmnopqrstuvwxyz-,./ 1234567890;#";
	var tempAlpha = ch.toLowerCase();
	if (validAlpha.indexOf(tempAlpha,0) == -1) return false; 
	return true;
}
function validCN(nm)
{
	for (i=0; i< nm.length; i++){
		if (isValid(nm.charAt(i)) == false) { return false; }		
	}
	return true;
}
function validState(st)
{
	var validAlpha="abcdefghijklmnopqrstuvwxyz";
	var tempAlpha; 
	if (st.length != 2)
		return false;
	for (i=0; i< 2; i++){
		tempAlpha = st.charAt(i).toLowerCase();
		if (validAlpha.indexOf(tempAlpha,0) == -1) return false; 			
	}
	return true;
}
function validCountry (ct)
{
	var valct = new Array("us","usa","can","ca","canada");
	var tmpct = ct.toLowerCase();
	for (i=0; i< valct.length; i++){
		if (tmpct == valct[i])
			return true;				
	}
	return false;
}
function SetPage(val){
window.location = "client:walletpanelaction?NextPanel=" + val;
}
function PrettyPhoneNum(phone)
{
	var formatph = "(";
	for (i=0; i<3; i++)
		formatph += phone.charAt(i);
	formatph += ") ";
    for (i=3; i<6; i++)
		formatph += phone.charAt(i);
	formatph += "-";
	for (i=6; i<10; i++)
    	formatph += phone.charAt(i);
	return formatph;
}
