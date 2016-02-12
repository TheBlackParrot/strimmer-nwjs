var active_data;

function clearList() {
	var rows = $(".main_table tr");

	rows.each(function(i, row) {
		if(!i) {
			return true;
		}

		row.remove();
	});
}

var good_response_codes = ["302", "200", "201", "203"];
var service_response_codes = ["500", "502", "503", "504"];

function addTableRows(data, inverse) {
	var table = $(".main_table");
	var rows = $(".main_table tr");

	var pos = 0;

	data.forEach(function(entry, i) {
		var row = $('<tr></tr>');

		if(inverse) {
			if(isNaN(pos)) {
				pos = 0; // what the hell
			}
			pos++;
			position++;
		} else {
			var pos = (isNaN(position) ? 0 : position) + i + 1;
		}

		row.append("<td>" + pos + "</td>");

		var title_cell = $("<td></td>");
		var title_data = entry.TITLE;
		if(entry.LAST_API_RESPONSE_CODE != null) {
			if(good_response_codes.indexOf(entry.LAST_API_RESPONSE_CODE) == -1) {
				if(service_response_codes.indexOf(entry.LAST_API_RESPONSE_CODE) != -1) {
					title_data = '<i class="fa fa-exclamation-triangle" style="color: #FFEB3B;"></i> ' + entry.TITLE;
				} else {
					title_data = '<i class="fa fa-times-circle" style="color: #F44336;"></i> ' + entry.TITLE;
				}
			}
		}
		title_cell.html(title_data);
		row.append(title_cell);
		
		row.append("<td>" + entry.ARTIST + "</td>");

		row.attr("trackid", entry.STRIMMER_ID);
		row.addClass("song_row");

		if(old_track == entry.STRIMMER_ID) {
			row.addClass("playing_row");
		}

		if(inverse) {
			$(".song_row td:first-child").each(function() {
				$(this).text(parseInt($(this).text())+1);
			});

			$(".main_table tr:first-child").after(row);
		} else {
			table.append(row);
		}
	});
}

function resetList(data) {
	clearList();

	position = 0;

	addTableRows(data.slice(position, (position + 100)));
	position += 100;

	active_data = data;
}

var active_view = "library";
$('.list-item:not(.dialog-item)').on("click", function() {
	$(".list-item").removeClass("active_row");
	$(this).addClass("active_row");

	var view = $(this).attr("view");
	console.log("Switched to " + view);

	active_view = view;

	switch(view) {
		case "library":
			active_data = library_data;
			break;

		case "mymusic":
			active_data = $.grep(library_data, function(row) {
				return row.ADDED_BY == user_data.USERNAME;
			});
			break;

		case "favorites":
			active_data = $.grep(library_data, function(row) {
				return ((favorite_data.indexOf(row.STRIMMER_ID)+1) ? 1 : 0);
			});
			break;

		case "queue":
			getQueuedTracks(function(data) {
				resetList(data);
			});
			return;
			break;

		case "history":
			getPlayHistory(function(data) {
				resetList(data);
			});
			return;
			break;

		default:
			active_data = library_data;
			break;
	}

	resetList(active_data);
});