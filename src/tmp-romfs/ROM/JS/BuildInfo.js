// These should be generated at build time by zefie's scripts

function bI(i) {
	switch (i) {
		case "packed_date":
			return "!TEMPLATE_DATE!"
			break;
		case "version":
			return "!TEMPLATE_VERS!";
			break;			
		case "romtype":
			return "!TEMPLATE_ROM!";
	}
}