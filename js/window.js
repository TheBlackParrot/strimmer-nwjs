var maxState = 0;
var win = nw.Window.get();

$("#close").on("click", function(){
	win.close();
});
$("#min").on("click", function(){
	win.minimize();
});
$("#max").on("click", function(){
	switch(maxState) {
		case 0:
			$(this).html('<i class="fa fa-chevron-circle-right"></i>');
			maxState = 1;
			win.maximize();
			break;

		case 1:
			$(this).html('<i class="fa fa-chevron-circle-up"></i>');
			maxState = 0;
			win.restore();
			break;
	}
});

$(".loader").css("left", ($(window).width()/2) - ($(".loader").width()/2) + "px");
$(".loader").css("top", ($(".loading_overlay").height()/2) - ($(".loader").height()/2) + "px");

var loading_progress = 0;
function checkIfDoneLoading() {
	loading_progress++;
	if(loading_progress == 3) {
		$(".loading_overlay").fadeOut(500);
	}
}

$(document).ready(function() {
	$(".loader").fadeIn(500);
});