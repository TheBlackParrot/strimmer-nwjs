var querystring = require('querystring');
var fs = require('fs');

var nwgui = window.require('nw.gui');

var StrimmerAPIKeys = require('./config/strimmer.json');
var settings = require('./config/config.json');

nw.Window.get().showDevTools();

//var library_data = require('./testdata.json');

$(".info").css("width", $(".side_bar").width() + "px");

function isValidUrl(str) {
	var regexp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
	return regexp.test(str);  
}

function unixTimestamp() {
	return Date.now() / 1000 | 0;
}

function findTrackByID(trackid) {
	return $.grep(library_data, function(entry) {
		return entry.STRIMMER_ID == trackid;
	})[0];
}

var time_offset = 0;
function getStrimmerLibrary(callback) {
	var url = settings.strimmer_host + 'fetch/tracks.php';
	$.ajax({
		type: 'GET',
		url: url,
		contentType: 'text/plain',
		dataType: 'json',
		xhrFields: {
			withCredentials: false
		},
		success: function(data) {
			library_data = data.RETURN_DATA;

			if(typeof callback === "function") {
				callback(data.RETURN_DATA);
			}

			time_offset = unixTimestamp() - data.METADATA.TIMESTAMP;
			console.log("Client is " + time_offset + " seconds off from the server");

			last_new_check = unixTimestamp() - time_offset;
		},
		error: function() {
			console.log("error");
		}
	});
}

var position;
getStrimmerLibrary(function(data){
	active_data = data;

	addTableRows(data.slice(0, 100));
	position = 100;
	
	checkIfDoneLoading();
	
	checkForTrackUpdate();
});

var last_active_row;

$(".main_table").on("click", ".song_row", function(event) {
	event.stopPropagation();

	var clicked = $(this).attr("trackid");
	
	var found = $.grep(library_data, function(row) {
		return row.STRIMMER_ID == clicked;
	});
	var track = found[0];

	updateTrackInfo(track, "selection");

	$('.song_row[trackid="' + last_active_row + '"]').removeClass("active_row");
	$(".song_row[trackid=" + clicked + "]").addClass("active_row");
	last_active_row = clicked;
});

var active_view_mode = "live";
function updateTrackInfo(data, mode) {
	if($(".current_track").attr("trackid") == data.STRIMMER_ID) {
		return;
	}

	var good_response_codes = ["302", "200", "201", "203"];
	var service_response_codes = ["500", "502", "503", "504"];

	var notif_data;
	if(data.LAST_API_RESPONSE_CODE != null) {
		if(good_response_codes.indexOf(data.LAST_API_RESPONSE_CODE) == -1) {
			if(service_response_codes.indexOf(data.LAST_API_RESPONSE_CODE) != -1) {
				notif_data = '<i class="fa fa-exclamation-triangle warning_n" style="color: #FFEB3B; font-size: 20pt;"></i><strong>' + data.TITLE + '</strong>';
				notif_data += " has been tagged with a service issue code (" + data.LAST_API_RESPONSE_CODE + ")<br/><br/>";
				notif_data += "<strong>This track may continue playing in the future and will still act normal.</strong>";
			} else {
				notif_data = '<i class="fa fa-times-circle warning_e" style="color: #F44336; font-size: 20pt;"></i><strong>' + data.TITLE + '</strong>';
				notif_data += " has been tagged with a service error code (" + data.LAST_API_RESPONSE_CODE + ")<br/><br/>";
				notif_data += "<strong>This track can no longer be played until the error is fixed, or a replacement is added.</strong>";
			}
		}
	}
	if(typeof notif_data !== "undefined") {
		addNotification(notif_data);
	}
	
	var art = data.ART_PERMALINK;

	switch(data.SERVICE) {
		case "SDCL":
			art = art.replace("large.jpg", "t500x500.jpg");
			break;
	}

	switch($(".art").attr("shown")) {
		case "1":
			$(".a2").attr("src", art);
			$(".art").attr("shown", "2");
			break;

		case "2":
			$(".a1").attr("src", art);
			$(".art").attr("shown", "1");
			break;
	}

	$(".current_track .title").text(data.TITLE);
	$(".current_track .artist").text(data.ARTIST);

	if(favorite_data.indexOf(data.STRIMMER_ID)+1) {
		$("#unfave, #fave").attr("id", "unfave");
	} else {
		$("#unfave, #fave").attr("id", "fave");
	}

	checkIfQueued(data.STRIMMER_ID, function(result) {
		var element = $("#queue, #unqueue");
		if(result == 1) {
			console.log(data.STRIMMER_ID + " is queued");

			canUserQueue("unqueue", data.STRIMMER_ID, function(result2) {
				if(result2 == 1) {
					console.log("user can unqueue");
					element.attr("id", "unqueue");
					element.attr("disabled", "0");
				} else {
					console.log("user cannot unqueue");
					element.attr("disabled", "1");
				}
			});
		} else {
			console.log(data.STRIMMER_ID + " is not queued");

			canUserQueue("queue", data.STRIMMER_ID, function(result2) {
				if(result2 == 1) {
					console.log("user can queue");
					element.attr("id", "queue");
					element.attr("disabled", "0");
				} else {
					console.log("user cannot queue");
					element.attr("disabled", "1");
				}
			});	
		}
	});

	var newsrc = "images/" + data.SERVICE + ".png";
	if(newsrc != $(".current_track #service_icon").attr("src")) {
		$(".current_track #service_icon").fadeOut(100, function(){
				$(this).attr("src", newsrc);
				$(this).fadeIn(100);
		});
	}

	$(".current_track").attr("trackid", data.STRIMMER_ID);

	active_view_mode = mode;
}

$(".a1").on('load', function() {
	$(".a2").fadeOut(300);
	$(".a1").fadeIn(300);
});
$(".a2").on('load', function() {
	$(".a1").fadeOut(300);
	$(".a2").fadeIn(300);
});

function toggleInteractionButtons(bool) {
	if(typeof bool !== "undefined") {
		switch(bool) {
			case 1:
				$(".interaction_buttons").fadeIn(100);
				$("#service_icon").css("opacity", "1");
				break;

			case 0:
				$(".interaction_buttons").fadeOut(100);
				$("#service_icon").css("opacity", "0.66");
				break;
		}
	} else {
		if($(".interaction_buttons").is(":visible")) {
			$(".interaction_buttons").fadeOut(100);
		} else {
			$(".interaction_buttons").fadeIn(100);
		}
	}
}

$(".art").on("mouseenter", function(event) {
	toggleInteractionButtons(1);
});
$(".art").on("mouseleave", function(event) {
	toggleInteractionButtons(0);
});

$("#slideout_button").on("click", function(event) {
	event.stopPropagation();

	switch($(this).attr("active")) {
		case "0":
			$(".info").css("width", "75vw");
			$(this).attr("active", 1);
			$(this).children(".fa-caret-right").removeClass("fa-caret-right").addClass("fa-caret-left");
			break;

		case "1":
			$(".info").css("width", "224px");
			$(this).attr("active", 0);
			$(this).children(".fa-caret-left").removeClass("fa-caret-left").addClass("fa-caret-right");
			// see toggleInteractionButtons
			break;
	}
});

$(document).on("click", function(event) {
	if(last_active_row) {
		$('.song_row[trackid="' + last_active_row + '"]').removeClass("active_row");
		last_active_row = "";
	}

	var found = $.grep(library_data, function(row) {
		return row.STRIMMER_ID == old_track;
	});
	var track = found[0];

	updateTrackInfo(track, "live");
});

$(".volume_slider").on("input", function() {
	stream.volume = $(this).val()/100;
});