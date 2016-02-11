function getPlayHistory(callback) {
	var url = settings.strimmer_host + 'fetch/tracks.php?offset=0&amount=500&sort=added&order=asc&where=history';
	$.ajax({
		type: 'GET',
		url: url,
		contentType: 'text/plain',
		dataType: 'json',
		xhrFields: {
			withCredentials: false
		},
		success: function(data) {
			if(typeof callback === "function") {
				callback(data.RETURN_DATA);
			} else {
				return data;
			}
		},
		error: function() {
			console.log("error");
		}
	});
}