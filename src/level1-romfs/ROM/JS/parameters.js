var parameters = new Array();

function unspace( element ) {
	return element.split( '+' ).join( ' ' );
}

if ( location.search.length > 1 ) {
	var query = location.search.substring( 1, location.search.length );
	var pairs = query.split( '&' );
	
	for ( var index = 0; index < pairs.length; index++ ) {
		var element = pairs[index].split( '=' );
		parameters[element[0]] = unspace( unescape( element[1] ) );
	}
}
