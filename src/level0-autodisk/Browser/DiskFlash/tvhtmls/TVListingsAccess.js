var asd_curDisplayObject = null;
var asd_displayObjects = null;
var asd_formName = null;

function accessStatus_GetDisplay(status)
{
	if (asd_displayObjects == null) {
		asd_displayObjects = new Object();

		asd_displayObjects["ChannelAuthorized"] = null;
		asd_displayObjects["PPVNotPurchased"] = document.asd_payperview;
		asd_displayObjects["ChannelLocked"] = document.asd_lock;
		asd_displayObjects["Blackout"] = document.asd_blackout;
		asd_displayObjects["RatingsLock"] = document.asd_lock;
		asd_displayObjects["PPVLocked"] = document.asd_lock;
		asd_displayObjects["NonImpulsePPV"] = document.asd_subscribe;
		asd_displayObjects["Subscription"] = document.asd_subscribe;
		asd_displayObjects["ChannelFailure"] = document.asd_lock;
		asd_displayObjects["NIPPVNotAvailable"] = document.asd_lock;
	}

		// this bizarre, but you have to do it this way to prevent
		// a JellyScript error if the status item doesn't exist
	if (asd_displayObjects[status])
		return asd_displayObjects[status];
	else
		return null;
}

function accessStatus_Update(channel, time)
{
	var status = TVAccess.getStatus(channel, time);
	var newDisplayObject = accessStatus_GetDisplay(status);

	if (status == "ChannelAuthorized" || status == "PPVNotPurchased") {
		var cost = TVDatabase.getProgramCost(channel, time);
		var costString;

		if (cost != 0) {
			costString = (cost/100).toString();
			document.forms[asd_formName].cost.value = costString;
			document.forms[asd_formName].paid.value = costString;
		}

		if (TVDatabase.isProgramPurchased(channel, time))
			newDisplayObject = document.asd_paid;
	}

	if (newDisplayObject != asd_curDisplayObject) {
		if (asd_curDisplayObject != null)
			asd_curDisplayObject.visibility = "hidden";

		if (newDisplayObject != null)
			newDisplayObject.visibility = "visible";
		asd_curDisplayObject = newDisplayObject;
	}
}

function accessStatus_Hide()
{
	if (asd_curDisplayObject != null) {
		asd_curDisplayObject.visibility = "hidden";
		asd_curDisplayObject = null;
	}
}

function accessStatus_Write(formName)
{
	document.write(
		(formName == null ? "<form name=ppvStatus>" : "") +
		"<div id=asd_payperview style='visibility: hidden; position:absolute; top: 11; left: 7;'>" +
			"<font size=-1 color=ffcf69>" +
			"Cost to view $" +
			"<b><input id=cost type=text size=6 usestyle nobackground border=0 nocursor noselect></b>" +
		"</div>" +
		"<div id=asd_paid style='visibility: hidden; position:absolute; top: 11; left: 7;'>" +
			"<font size=-1 color=ffcf69>" +
			"Paid $" +
			"<b><input id=paid type=text size=6 usestyle nobackground border=0 nocursor noselect></b>" +
		"</div>" +
		(formName == null ? "</form>" : "") +
		"<div id=asd_subscribe style='visibility: hidden; position:absolute; top: 11; left: 7;'>" +
			"<font size=-1 color=ffcf69>" +
			"Call to subscribe" +
		"</div>" +
		"<div id=asd_blackout style='visibility: hidden; position:absolute; top: 11; left: 7;'>" +
			"<font size=-1 color=ffcf69>" +
			"Not available" +
		"</div>" +
		"<div id=asd_lock style='visibility: hidden; position:absolute; top: 0; left: 3;'>" +
			"<img src='file://ROM/tvimages/LockYellow_Locked.gif' width=22 height=30>" +
		"</div>"
		);

	asd_formName = (formName == null ? "ppvStatus" : formName);
}

