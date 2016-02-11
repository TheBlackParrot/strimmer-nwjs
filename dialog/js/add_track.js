var current_tab = "";

$(".add_track_tabs").on("mouseenter", ".tab", function(event) {
	bg_color = $(this).css("background-color");
});

$(".add_track_tabs").on("click", ".tab", function(event) {
	event.stopPropagation();

	var load_tab = $(this).attr("service");

	current_tab = load_tab;

	$(".dialog_content[tab=" + load_tab + "]").show();
	$(".dialog_content[tab!=" + load_tab + "]").hide();

	$(".add_track_tabs .tab[service!=" + load_tab + "]").each(function() {
		$(this).css("background", "linear-gradient(rgba(255,255,255,0.42), transparent) " + $(this).attr("bg"));
	});

	$(this).css("background", "linear-gradient(transparent, rgba(255,255,255,0.42)) " + $(this).attr("bg"));

	$(".add_track_status").each(function(){
		$(this).text("");
		$(this).css("color","transparent");
	});
});

$(".add_track_button").on("click", function(event) {
	event.stopPropagation();

	if(current_tab != "") {
		var form = $("." + current_tab + "_form");
		var url_data = form.serialize();
		var url = settings.strimmer_host + "functions/add_" + current_tab + "_track.php?" + encodeURI(StrimmerAPIKeys.key1) + "=" + encodeURI(StrimmerAPIKeys.key2) + "&" + url_data;
		//$(".add-track-status").text("Attempting to add your track...");
		//$(".add-track-status").css("color","#000");

		console.log(url);
		// will return a json object that can just be pushed into library_data
		$.ajax({
			type: 'GET',
			url: url,
			contentType: 'text/plain',
			dataType: 'json',
			xhrFields: {
				withCredentials: false
			},
			success: function(data) {
				if(typeof data == "object") {
					var new_data = data.RETURN_DATA[0];
					library_data.unshift(new_data);

					if(active_view == "library") {
						addTableRows(data.RETURN_DATA, true);
					}

					//$(".add-track-status").each(function(){
					//	$(this).text("Track successfully added!");
					//	$(this).css("color","#4CAF50");
					//});

					$(".url_input").val("");
				} else {
					console.log("There was an error with adding your track.<br/>" + data.responseText);
					//$(this).html("There was an error with adding your track.<br/>" + data.responseText);
					//$(this).css("color","#F44336");
				}
			},
			error: function(data) {
				//$(".add-track-status").each(function(){
				//	$(this).html("There was an error with adding your track. See the developer console for more information.<br/>" + data.responseText);
				//	$(this).css("color","#F44336");
				//});
				console.log("There was an error with adding your track.<br/>" + data.responseText);
			}
		});
	}
})