var querystring = require('querystring');
var fs = require('fs');

var StrimmerAPIKeys = require('./config/strimmer.json');
var settings = require('./config/config.json');

require('nw.gui').Window.get().showDevTools();

//var library_data = require('./testdata.json');

$(".info").css("width", $(".side_bar").width() + "px");

function isValidUrl(str) {
	var regexp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
	return regexp.test(str);  
}

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
		},
		error: function() {
			console.log("error");
		}
	});
}

var position;
getStrimmerLibrary(function(data){
	addTableRows(data.slice(0, 100));
	position = 100;
	checkIfDoneLoading();
	checkForTrackUpdate();
});

function clearList() {
	var rows = $(".main_table tr");

	rows.each(function(i, row) {
		if(!i) {
			return true;
		}

		row.remove();
	});
}

function addTableRows(data) {
	var table = $(".main_table");
	var rows = $(".main_table tr");

	data.forEach(function(entry, i) {
		var row = $('<tr></tr>');

		var pos = (isNaN(position) ? 0 : position) + i + 1;

		row.append("<td>" + pos + "</td>");
		row.append("<td>" + entry.TITLE + "</td>");
		row.append("<td>" + entry.ARTIST + "</td>");

		row.attr("trackid", entry.STRIMMER_ID);
		row.addClass("song_row");

		table.append(row);
	});
}

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

function toggleInteractionButtons() {
	if($(".interaction_buttons").is(":visible")) {
		$(".interaction_buttons").fadeOut(200, function() {
			$(".info .title, .info .artist").css("width", "calc(100% - 32px)");
		});
	} else {
		$(".interaction_buttons").fadeIn(200);
	}
}

$("#slideout_button").on("click", function(event) {
	event.stopPropagation();

	switch($(this).attr("active")) {
		case "0":
			$(".info").css("width", "75vw");
			$(this).attr("active", 1);
			$(this).children(".fa-caret-right").removeClass("fa-caret-right").addClass("fa-caret-left");
			$(".info .title, .info .artist").css("width", "calc(100% - 160px)");
			break;

		case "1":
			$(".info").css("width", "224px");
			$(this).attr("active", 0);
			$(this).children(".fa-caret-left").removeClass("fa-caret-left").addClass("fa-caret-right");
			// see toggleInteractionButtons
			break;
	}

	toggleInteractionButtons();
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