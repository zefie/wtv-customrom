var yakClock_dayNames = new Array( "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT" );
var yakClock_monthNames = new Array( "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
								"JUL", "AUG", "SEP", "OCT", "NOV", "DEC" );

function yakClock_GetTimeString(dateObj)
{
	var dateTimeString;
	var hours, minutes, ampm;

	dateTimeString = yakClock_dayNames[dateObj.getDay()] + " " +
		yakClock_monthNames[dateObj.getMonth()] + " " +
		dateObj.getDate() + "  ";

		// convert military time to 12 hour format
	hours = dateObj.getHours();
	if (hours < 12) {
		ampm = "AM";
	} else
		ampm = "PM";
	hours = ((hours + 11) % 12) + 1;

		// prepend a zero on the minutes, if necessary
	minutes = dateObj.getMinutes();
	if ( minutes.toString().length == 1 )
		minutes = "0" + minutes;

	dateTimeString += hours + ":" + minutes + " " + ampm;

	return dateTimeString;
}

function yakClock_Update()
{
	var now = new Date();

	document.forms.yakClockForm.yakClock_Time.value = yakClock_GetTimeString(now);

	setTimeout(yakClock_Update, (59 - now.getSeconds()) * 1000);
}

function yakClock_Write(formName)
{
	if (formName == null)
		formName = "yakClockForm";

	document.write(
		"<form id=" + formName + ">" +
		"<input type=text name=yakClock_Time size=24 halign=right value='' border=0 usestyle nobackground nocursor noselect nosubmit>" +
		"</form>"
		);
}
