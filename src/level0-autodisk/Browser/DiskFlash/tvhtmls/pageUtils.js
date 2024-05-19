function unSpace( element ) {
	return element.split( '+' ).join( ' ' );
}	

function parsePageParams()
{
		// stole this from Prashant's stuff in Springboard2.2
	var parameters = new Array();

	if ( location.search.length > 1 ) {
		var query = location.search.substring( 1, location.search.length );
		var pairs = query.split( '&' );		
		for ( var index = 0; index < pairs.length; index++ ) {
			var element = pairs[index].split( '=' );
			parameters[element[0]] = unSpace( unescape( element[1] ) );
		}
	}

	return parameters;
}

function makeStringHTMLProof(name)
{
	var pieces;
	var safeName = name;

		// nullify amp strings
	pieces = name.split("&");
	if (pieces.length > 0)
		safeName = pieces.join("&amp;");

		// nullify HTML tags
	pieces = safeName.split("<");
	if (pieces.length > 0)
		safeName = pieces.join("&lt;");
	pieces = safeName.split(">");
	if (pieces.length > 0)
		safeName = pieces.join("&gt;");

	return safeName;
}

