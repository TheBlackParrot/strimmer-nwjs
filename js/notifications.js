$(document).on("click", ".notification", function(event) {
	event.stopPropagation();

	$(this).fadeOut(150, function() {
		$(this).remove();
	});
});

function addNotification(html) {
	var notification = $('<div class="notification"></div>');
	notification.html(html);

	$(".notifications").append(notification);
	notification.fadeIn(150);

	setTimeout(function() {
		notification.trigger("click");
	}, 10000);
}