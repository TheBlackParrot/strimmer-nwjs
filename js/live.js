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

function getStrimmerProgress(type,callback) {
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

setInterval(function(){
	setRealtimeData();
}, 1000);

setInterval(function(){
	checkForTrackUpdate();
}, 5000);

setRealtimeData();