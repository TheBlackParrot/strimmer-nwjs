function queueStrimmerTrack(action, trackid, callback) {
	if(action == "unqueue") {
		var url = settings.strimmer_host + 'functions/unqueue.php?' + encodeURI(StrimmerAPIKeys.key1) + '=' + encodeURI(StrimmerAPIKeys.key2) + '&ID=' + encodeURI(trackid);
	} else {
		var url = settings.strimmer_host + 'functions/queue.php?' + encodeURI(StrimmerAPIKeys.key1) + '=' + encodeURI(StrimmerAPIKeys.key2) + '&ID=' + encodeURI(trackid);
	}
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

function checkIfQueued(trackid, callback) {
	var url = settings.strimmer_host + 'fetch/queued.php?ID=' + encodeURI(trackid);
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

function canUserQueue(action, trackid, callback) {
	if(action == "unqueue") {
		var url = settings.strimmer_host + 'users/can_unqueue.php?' + encodeURI(StrimmerAPIKeys.key1) + '=' + encodeURI(StrimmerAPIKeys.key2) + '&ID=' + encodeURI(trackid);
	} else {
		var url = settings.strimmer_host + 'users/can_queue.php?' + encodeURI(StrimmerAPIKeys.key1) + '=' + encodeURI(StrimmerAPIKeys.key2) + '&ID=' + encodeURI(trackid);
	}
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

$("#queue, #unqueue").on("click",function(event) {
	event.stopPropagation();

	var trackid = $(".current_track").attr("trackid");
	var element = $(this);

	var current_mode = element.attr("id");

	if(!parseInt(element.attr("disabled"))) {
		var track = findTrackByID(trackid);

		if(current_mode == "unqueue") {
			queueStrimmerTrack("unqueue", trackid, function(){
				element.attr("id", "queue");
				addNotification('<i class="fa fa-info-circle .info_symbol"></i>' + "Unqueued " + track.TITLE);
			});
		} else {
			queueStrimmerTrack("queue",trackid,function(){
				element.attr("id", "unqueue");
				addNotification('<i class="fa fa-info-circle .info_symbol"></i>' + "Queued " + track.TITLE);
			});
		}
	}
});