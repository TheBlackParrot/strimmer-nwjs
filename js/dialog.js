$(".dialog-item").on("click", function(event) {
	event.stopPropagation();
	fs.readFile('./dialog/' + $(this).attr("dialog") + '.html', 'utf-8', function(error, data) {
		if(error) {
			throw error;
		}
		
		$(".dialog_overlay").fadeIn(200);

		$(".dialog").html(data);
		$(".dialog").fadeIn(200);
	});
});

$(document).on("click", ".dialog_close", function(event) {
	event.stopPropagation();

	$(".dialog_overlay").fadeOut(200);
	$(".dialog").fadeOut(200);
});