var stream = $("#stream")[0];

stream.onloadeddata = function() {
	this.volume = 0.5;
	console.log("Loaded metadata");
}

$("#stream").ready(function() {
	if(!settings.stream.enabled) {
		return;
	}

	console.log("Loading stream...");
	$("#stream_source").attr("src", settings.stream.url);

	stream.load();
	stream.play();
});