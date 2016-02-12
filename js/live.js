function getStrimmerNowPlaying(verbosity,type,dataType,callback) {
	var url = settings.strimmer_host + 'fetch/playing.php?verbosity=' + encodeURI(verbosity) + '&type=' + encodeURI(type);
	//console.log(url);

	$.ajax({
		type: 'GET',
		url: url,
		contentType: 'text/plain',
		dataType: dataType,
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

function getStrimmerProgress(type, callback) {
	var url = settings.strimmer_host + 'fetch/progress.php?type=' + encodeURI(type);
	//console.log(url);

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

function getRecentTracks(count_only, callback) {
	if(typeof last_new_check === "undefined") {
		return;
	}

	if(count_only) {
		var url = settings.strimmer_host + 'fetch/recent.php?time=' + encodeURI(last_new_check) + '&count_only=1';
		var dataType = "text";
	} else {
		var url = settings.strimmer_host + 'fetch/recent.php?time=' + encodeURI(last_new_check) + '&order=asc';
		var dataType = "json";
	}

	$.ajax({
		type: 'GET',
		url: url,
		contentType: 'text/plain',
		dataType: 'json',
		xhrFields: {
			withCredentials: false
		},
		success: function(data) {
			console.log(data);
			console.log(last_new_check);
			if(typeof callback === "function") {
				callback(data);
			}
		},
		error: function() {
			console.log("error");
		}
	});
}

var old_track;

function checkForTrackUpdate() {
	if(typeof library_data === "undefined") {
		return;
	}

	getStrimmerNowPlaying("low", "none", "text", function(data){
		console.log(data);
		if(!old_track) {
			checkIfDoneLoading();
		}
		if(data != old_track) {
			console.log("Triggered, old was " + old_track + ", new was " + data);
			if(active_view_mode == "live") {
				var found = $.grep(library_data, function(row) {
					return row.STRIMMER_ID == data;
				});
				var track = found[0];

				updateTrackInfo(track, "live");
			}
			$(".playing_row").removeClass("playing_row");
			$('.song_row[trackid="' + data + '"]').addClass("playing_row");
		}
		old_track = data;
	});
}

function setRealtimeData() {
	getStrimmerProgress("all", function(data){
		var lines = data.split("\r\n");
		$("#elapsed").html(lines[1]);
		$("#bar_elapsed").css("width",lines[0] + "%");
		$("#length").html(lines[2]);
	});
}

var last_new_check;

function checkForNewTracks() {
	getRecentTracks(1, function(data) {
		var amount = parseInt(data);

		if(amount > 0) {
			getNewTracks();
			return;
		}

		last_new_check = unixTimestamp() - time_offset;
	});
}

function getNewTracks() {
	getRecentTracks(0, function(data) {
		var notif_data = "<strong>The following track(s) were added to the library:</strong><br/>";
		data.RETURN_DATA.forEach(function(entry) {
			library_data.unshift(entry);
			notif_data += entry.ARTIST + " - " + entry.TITLE + " [" + entry.STRIMMER_ID + "]";
		});
		notif_data += "<br/>";
		addNotification(notif_data);
		
		if(active_view == "library") {
			addTableRows(data.RETURN_DATA, 1);
		}

		last_new_check = unixTimestamp() - time_offset;
	});
}

setInterval(function() {
	setRealtimeData();
}, 1000);

setInterval(function() {
	checkForTrackUpdate();
}, 5000);

setInterval(function() {
	checkForNewTracks();
}, 10000);

setRealtimeData();