// ver 0.5
document.addEventListener('DOMContentLoaded', bindClicks);

function bindClicks () {
	
	var html = document.getElementsByTagName('html')[0];
		contents = document.getElementById('contents'),
		dropdown = document.getElementById('dropdown'),
		drpdwnLi = dropdown.children;
	// console.log(html);
	html.addEventListener('click', function (event) {
		dropdown.style.visibility = 'hidden';
		// event.preventDefault();
	});
	
	contents.addEventListener('click', function (event) {
		hideEl(dropdown);
		event.stopPropagation();
	});

	for (var i = 0; i < drpdwnLi.length; i++) {
		drpdwnLi[i].firstElementChild.addEventListener('click', function (event) {
			hideEl(dropdown);
			// event.preventDefault();
		});
	};
	
}

function hideEl (element) {
	element.style.visibility = (element.style.visibility != 'visible') ? 'visible' : 'hidden';
}