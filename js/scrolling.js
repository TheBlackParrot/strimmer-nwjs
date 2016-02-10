var loading = 0;

$(".main_table_wrapper").scroll(function() {
	var scrollBottom = $(".main_table_wrapper").scrollTop() + $(".main_table_wrapper").height();
	console.log(scrollBottom);

	if(scrollBottom >= $(".main_table").height()) {
		if(!loading) {
			loading = 1;

			addTableRows(library_data.slice(position, (position + 100)));
			position += 100;
			
			loading = 0;
		}
	}
});