function updateSearchTerm(search_term) {
	if(!search_term) {
		switchView(active_view);
		return;
	}

	var found = [];

	library_data.forEach(function(entry) {
		for(value in entry) {
			var data = entry[value];

			if(typeof data === "string") {
				if(data.toLowerCase().indexOf(search_term) != -1) {
					found.push(entry);
					break;
				}
			}
		}
	});
	
	active_data = found;
	clearList(active_data);

	position = 0;
	addTableRows(found.slice(0, 100));
	position = 100;
}

$("#search_field").on("input", function() {
	updateSearchTerm($(this).val());
});