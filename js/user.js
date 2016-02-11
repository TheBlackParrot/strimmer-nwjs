var user_data;

function getStrimmerUserData(callback) {
	var url = settings.strimmer_host + 'users/info.php?' + encodeURI(StrimmerAPIKeys.key1) + '=' + encodeURI(StrimmerAPIKeys.key2) + '&type=json';

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
				callback(data);
			}
		},
		error: function() {
			console.log("error");
		}
	});
}

getStrimmerUserData(function(data) {
	user_data = data;
	setUserData(data);
	checkIfDoneLoading();
});

var favorite_data;
function setUserData(data) {
	switch(data.RANK) {
		case "4": $("#rank").text("Admin"); break;
		case "3": $("#rank").text("Curator"); break;
		case "2": $("#rank").text("User"); break;
		case "1": $("#rank").text("Listener"); break;
		case "0": $("#rank").text(""); break;
	}

	$("#username").text(data.USERNAME);

	favorite_data = data.FAVORITES.split(";");
}