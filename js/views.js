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

		if(old_track == entry.STRIMMER_ID) {
			row.addClass("playing_row");
		}

		table.append(row);
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
$(".list-item").on("click", function() {
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
			var favorites = user_data.FAVORITES.split(";");

			active_data = $.grep(library_data, function(row) {
				return ((favorites.indexOf(row.STRIMMER_ID)+1) ? 1 : 0);
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