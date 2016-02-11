function favoriteStrimmerTrack(trackid, callback) {
	var url = settings.strimmer_host + 'functions/favorite.php?' + encodeURI(StrimmerAPIKeys.key1) + '=' + encodeURI(StrimmerAPIKeys.key2) + '&ID=' + encodeURI(trackid);
	$.ajax({
		type: 'GET',
		url: url,
		contentType: 'text/plain',
		dataType: 'text',
		xhrFields: {
			withCredentials: false
		},
		success: function(data) {
			if(typeof callback === "function") {
				callback(data);
			}
		},
		error: function() {
			console.log("error");
		}
	});
}

$("#fave, #unfave").on("click",function(event) {
	event.stopPropagation();
	
	var trackid = $(".current_track").attr("trackid");
	var element = $(this);

	favoriteStrimmerTrack(trackid, function(data){
		if(data == "1") {
			element.attr("id", "unfave");
			favorite_data.push(trackid);
		} else {
			element.attr("id", "fave");
			favorite_data.pop(trackid);
		}
	});
});