function signalMeter_writeHTML(segmentCount, segmentWidth, segmentHeight, segmentColor)
{
	var htmlString;

	if (segmentCount == null || segmentCount == 0)
		segmentCount = 20;

	if (segmentWidth == null || segmentWidth == 0)
		segmentWidth = 9;

	if (segmentHeight == null || segmentHeight == 0)
		segmentHeight = 13;

	this.segmentCount = segmentCount;
	this.signalFactor = segmentCount / 100;

	htmlString = "<table cellspacing=1 cellpadding=0><tr>";
	for (var segmentIndex = 0; segmentIndex < segmentCount; segmentIndex++) {
		htmlString += "<td width=" + segmentWidth + " height=" + segmentHeight + " bgcolor=000000>" +
			"<div style='visibility: hidden;' id='" + this.meterName + segmentIndex +
			"' width=" + segmentWidth + " height=" + segmentHeight +
			" bgcolor=" + segmentColor + "></div>";
	}
	htmlString += "</table>";

	document.write(htmlString);
}

function signalMeter_setSignal(newSignal)
{
	var segmentIndex;
	var startSignal = this.signal;
	var endSignal = Math.round(newSignal * this.signalFactor);

	this.signal = endSignal;

	if (startSignal <= endSignal) {
		for (segmentIndex = startSignal; segmentIndex < endSignal; segmentIndex++)
			document.all[this.meterName + segmentIndex].visibility = "visible";
	} else {
		for (segmentIndex = startSignal; --segmentIndex >= endSignal; )
			document.all[this.meterName + segmentIndex].visibility = "hidden";
	}
}

function signalMeter(meterName)
{
	this.meterName = meterName + "Seg";
	this.segmentCount = 0;
	this.signalFactor = 0;
	this.signal = 0;
	this.setSignal = signalMeter_setSignal;
	this.writeHTML = signalMeter_writeHTML;
}
