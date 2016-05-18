// ver 0.5
document.addEventListener('DOMContentLoaded', bindClicks);
document.addEventListener('DOMContentLoaded', addCodeIndents);
document.addEventListener('DOMContentLoaded', doAPIcalls);

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

function addCodeIndents () {
	var code = document.getElementsByTagName('code'),
		attr,
		codeText,
		spaces = '  ';
		tab = '';
	for (var i = 0; i < code.length; i++) {
		attr = code[i].getAttribute('rel');
		// console.log(attr);
		if(attr === "JSON"){
			spaces = '  ';
			tab = '';
			// get rid of initial space
			codeText = code[i].innerHTML.replace(/\s+/, '');
			// replace some commas with special symbol
			codeText = codeText.replace(/,(?=")/g, '≤')
			// format breaks and tabs
				.replace(/[{}≤]/g, function (ch) {
			// codeText = codeText.replace(/[{}≤]/g, function (ch) {
				if(ch === "{" ){//|| ch === "["){
					tab += spaces;
					ch = ch + '<br>' + tab;
					return ch;
				} else if (ch === "}"){//} || ch === "]") {
					tab = tab.slice(spaces.length);
					ch = '<br>' + tab + ch;// + '<br>';
					// console.log(spaces.length);
					
					return ch;
				} else {
					ch = ch + '<br>' + tab;
					return ch;
				}
					
			});
			// replace special symbol
			codeText = codeText.replace(/≤/g, ',')
			// replace spaces with HTML space
				.replace(/\s/g, '&nbsp;');
			code[i].innerHTML = codeText;
		} else if (attr === "JavaScript") {
			spaces = '  ';
			tab = '';

			// get rid of initial space
			codeText = code[i].innerHTML;
			// replace some commas with special symbol
			codeText = codeText.replace(/\s+/, '');
			codeText = codeText.replace(/\);(?!\s*\})/g, ')≤');
			
			console.log(codeText);
			// format breaks and tabs
			codeText = codeText.replace(/[{}≤]/g, function (ch) {
			// codeText = codeText.replace(/[{}≤]/g, function (ch) {
				if(ch === "{" ){//|| ch === "["){
					tab += spaces;
					console.log(tab.length);
					ch = ch + '<br>' + tab;
					return ch;
				} else if (ch === "}"){//} || ch === "]") {
					tab = tab.slice(spaces.length);
					// tab = tab.slice(2);
					ch = '<br>' + tab + ch;// + '<br>';
					// ch = tab + ch;// + '<br>';
					// console.log(spaces.length);
					
					return ch;
				} else {
					ch = ch + '<br>' + tab;
					// ch = ch + '<br>';
					return ch;
				}
					
			});
			// replace special symbol
			codeText = codeText.replace(/≤/g, ';')
			// // replace spaces with HTML space
			console.log(codeText);
			codeText=codeText.replace(/\s/g, '&nbsp;');
			code[i].innerHTML = codeText;
			
		}
	}
}

function doAPIcalls () {
	var data, url;
	var req = new XMLHttpRequest();
	req.open("GET", "https://api.soundcloud.com/users/52119028?client_id=1306a99549a44496515f2e61993af805");
	req.addEventListener('load', function () {
		if(req.status >= 200 && req.status < 400){ // check for valid request
			// var response = 
			data = JSON.parse(req.responseText);
			console.log(data);
			var permalink = document.getElementById('permalink');
			permalink.textContent = data.permalink_url;
			
		} else {
			console.log("Whoops, something went wrong. Maybe: ", req.statusText);
		}
	});
	req.send();

}

function hideEl (element) {
	element.style.visibility = (element.style.visibility != 'visible') ? 'visible' : 'hidden';
}