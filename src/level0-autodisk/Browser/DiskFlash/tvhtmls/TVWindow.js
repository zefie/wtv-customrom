// this script writes out a standard "small" TV window
// such as the one on the TVListings page(s).

function writeTVWindow(showChannelDisplay, tvDisplayAttributes, tvCellAttributes, tvChannelAttributes, tvFontAttributes)
{
	var tvHeight;

	if (showChannelDisplay)
		tvHeight = "143";
	else
		tvHeight = "120";

	if (tvFontAttributes == null || tvFontAttributes.length == 0)
		tvFontAttributes = "size=-1 color=4e7f64";

	if (tvChannelAttributes == null || tvChannelAttributes.length == 0)
		tvChannelAttributes = "id=channelText text=4e7f64 halign=right";

	document.write(
		"<table cellspacing=0 cellpadding=0>" +
			"<tr><td abswidth=10 absheight=3>" +
			"<img src=file://ROM/tvimages/VideoBorder_TopLeft.gif width=10 height=3>" +
				"<td abswidth=160 absheight=3>" +
				"<img src=file://ROM/tvimages/VideoBorderEdge_Top.gif width=160 height=3>" +
				"<td abswidth=10 absheight=3>" +
			"<img src=file://ROM/tvimages/VideoBorder_TopRight.gif width=10 height=3>"
		);

	document.write(
			"<tr><td abswidth=10 absheight=" + tvHeight + ">" +
				"<img src=file://ROM/tvimages/VideoBorderEdge_Left.gif width=10 height=" + tvHeight + ">" +
				"<td abswidth=160 absheight=" + tvHeight + " align=right valign=top " + tvCellAttributes + ">" +
				"<font size=-1 color=#6a8cd2>" +
					"<tv width=160 height=120 " + tvDisplayAttributes + ">" +
				"</font>"
			);

		// put a little channel display below the TV
	if ( showChannelDisplay ) {
		var channel = TVController.channel;

		// JOHN SHAFT SLEPT HERE
		var callLetters = TVDatabase.getNetworkOrCallSign(channel);

		if (callLetters == null || callLetters == "")
			callLetters = "&nbsp;";

		document.write(
				"<br><spacer type=vertical height=6>" +
				"<table cellspacing=0 cellpadding=0>" +
					"<tr><td valign=top>" +
						"<font " + tvFontAttributes + ">" +
							"<channeldisplay channel=" + channel +
								" network=\"" + callLetters + "\" " + tvChannelAttributes + ">" +
						"</font>" +
				"</table>"
			);
	}

	document.write(
			"<td abswidth=10 absheight=" + tvHeight + ">" +
			"<img src=file://ROM/tvimages/VideoBorderEdge_Right.gif width=10 height=" + tvHeight + ">"
		);

	document.write(
			"<tr><td abswidth=10 absheight=3>" +
			"<img src=file://ROM/tvimages/VideoBorder_BotLeft.gif width=10 height=3>" +
				"<td abswidth=160 absheight=3>" +
				"<img src=file://ROM/tvimages/VideoBorderEdge_Bottom.gif width=160 height=3>" +
				"<td abswidth=10 absheight=3>" +
			"<img src=file://ROM/tvimages/VideoBorder_BotRight.gif width=10 height=3>" +
		"</table>"
		);
}



