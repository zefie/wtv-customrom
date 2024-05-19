// This file contains various JavaScript utility functions to support
// ads.

function WriteAd(adType)
{
	if (top.clientVersion() >= 3) {
		var adengine = new ActiveXObject("clsid:00004602-0C8A-11D2-BEEF-00A0C9AA0831");
		var request = new ActiveXObject("clsid:00004414-0C8A-11D2-BEEF-00A0C9AA0831");
		var response = new ActiveXObject("clsid:00004414-0C8A-11D2-BEEF-00A0C9AA0831");
		
		// making the request node
		var requestnode = request.documentElement;
		requestnode.insertBefore(request.createPI("xml", "version=\"1.0\""), nill);
		requestnode.insertBefore(request.createElement("request", null), nill);
		var areanode = request.createElement("area", null);
		areanode.insertBefore(request.createTextNode(adType), areanode);

		var clicknode = request.createElement("clickthru", null);
		clicknode.insertBefore(request.createTextNode("http://www.hotmail.com"), clicknode);
		requestnode.insertBefore(areanode, nill);
		requestnode.insertBefore(clicknode, nill);

		var adcontent = "file://e:/development/WINCE212/PRIVATE/tvpak_browser/AdClient/adcontents.xml";
		var adreport = "file://e:/development/WINCE212/PRIVATE/tvpak_browser/AdClient/adreport.xml";

		adengine.Load(adcontent, adreport);
		Window.message("loaded the ad contents.");

		adengine.GetContent(requestnode, response);
		Window.message("Getting the ad contents.");

		requestnode.toXML("e:/request.xml");
		response.toXML("e:/response.xml");

		var creativenodelist = response.getElementsByTagName("creative");
		var clickthrunodelist = response.getElementsByTagName("clickthru");

		Window.message("creative len ", creativenodelist.length,
					   " clickthru len ", clickthrunodelist.length);

		if (clickthrunodelist.length > 0 && clickthrunodelist[0].firstChild.text != null)
			frames['MainFrameArea'].document.write("<a href=" + clickthrunodelist[0].firstChild.text + ">");
		if (creativenodelist.length > 0 && creativenodelist[0].firstChild.text != null)
			frames['MainFrameArea'].document.write("<img id=adImage src=" + creativenodelist[0].firstChild.text + ">");
	} else {
		frames['MainFrameArea'].document.write("<img id=adImage src=images/MockAd.gif>");
	}
}

