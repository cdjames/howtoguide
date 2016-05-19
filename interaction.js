// ver 0.5
document.addEventListener('DOMContentLoaded', bindClicks);
document.addEventListener('DOMContentLoaded', addCodeIndents);
document.addEventListener('DOMContentLoaded', doAPIcalls);
var USERID = 52119028,
	CLIENTID = '1306a99549a44496515f2e61993af805';

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
			
			// console.log(codeText);
			// format breaks and tabs
			codeText = codeText.replace(/[{}≤]/g, function (ch) {
			// codeText = codeText.replace(/[{}≤]/g, function (ch) {
				if(ch === "{" ){//|| ch === "["){
					tab += spaces;
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
			// console.log(codeText);
			codeText=codeText.replace(/\s/g, '&nbsp;');
			code[i].innerHTML = codeText;
			
		}
	}
}

function doAPIcalls () {
	var data, url;
	var req = new XMLHttpRequest();
	req.open("GET", "https://api.soundcloud.com/users/"+USERID+"?client_id="+CLIENTID, true);
	req.addEventListener('load', function () {
		if(req.status >= 200 && req.status < 400){ // check for valid request
			// var response = 
			data = JSON.parse(req.responseText);
			THEDATA = data;
			// console.log(data);
			var permalink = document.getElementById('permalink'),
				full_name = document.getElementById('full_name');
			if(permalink)
				permalink.textContent = data.permalink_url;
			if(full_name)
			{
				var span = document.createElement("span");
				span.textContent = data.full_name;
				full_name.appendChild(span);
			}
		} else {
			console.log("Whoops, something went wrong. Maybe: ", req.statusText);
		}
	});
	req.send();

	req2 = new XMLHttpRequest();
	req2.open("GET", "https://api.soundcloud.com/users/"+USERID+"/tracks?client_id="+CLIENTID, true);
	req2.addEventListener('load', function () {
		if(req2.status >= 200 && req2.status < 400){ // check for valid request
			data = JSON.parse(req2.responseText);
			var headers = ["title", "plays", "favoritings", "comments"],
				keys = ["title", "playback_count", "favoritings_count"],
				table;
			table = buildTable(data, headers, keys);
			// console.log(table);
			if(table)
			{
				var tbl = document.getElementById('track_table');
				tbl.appendChild(table);

				data.forEach(function (object) {
					var requ = new XMLHttpRequest();
					requ.open("GET", "https://api.soundcloud.com/tracks/"+object.id+"/comments?client_id="+CLIENTID, true);
					requ.addEventListener('load', function () {
						if(requ.status >= 200 && requ.status < 400){ // check for valid request
							// var table = document.getElementById('track_table');
							data = JSON.parse(requ.responseText);
							// console.log("comment data: ");
							// console.log(data);
							var uls = {}, ul, li;
							data.forEach(function (object) { //id, body
								if(object.user_id != USERID){
									if(!uls[object.track_id]){
										ul = document.createElement('ul');
										ul.id = 'c_'+object.track_id;
										uls[object.track_id] = ul;
									}
									li = document.createElement('li');
									li.textContent = object.body;
									uls[object.track_id].appendChild(li);
									// console.log(uls);
								}
							});
							var track;
							for(key in uls){
								// console.log(key);

								if(track = document.getElementById(key)){
									// console.log("found " + key);
									document.getElementById(key).appendChild(uls[key]);
								}
							}
						} else {
							console.log("Whoops, something went wrong. Maybe: ", req3.statusText);
						}
					});
					requ.send();
				});
			}
		} else {
			console.log("Whoops, something went wrong. Maybe: ", req2.statusText);
		}
	});
	req2.send();
}

function hideEl (element) {
	element.style.visibility = (element.style.visibility != 'visible') ? 'visible' : 'hidden';
}

function buildTable (data, headers, keys) {
	var table = document.createElement("table"), // the table element
		tr; // hold rows before appending

	/* build headers*/
	tr = buildRow(headers, "th");
	table.appendChild(tr);

	/* build rows */
	data.forEach(function (object, index) {
		var values = []
			track_id = object.id;
		/* make an array of values */
		for (var i = 0; i < keys.length; i++) {
			values.push(object[keys[i]]);
		};
	
		/* add a row */
		tr = buildRow(values, "td", track_id);
		table.appendChild(tr);
	})

	/* */
	function buildRow (array, type, track_id) { // an array of 
		var thisTr = document.createElement("tr"),
			column;
		/* create <td> or <th> elements */
		array.forEach(function (content) {
			column = document.createElement(type);
			/* for non-header items */
			column.textContent = content;
			/* add content and style */
			column.style.border = "solid 1px black";
			thisTr.id = track_id;
			thisTr.appendChild(column);
		});
		return thisTr;
	}

	table.style.borderCollapse = "collapse";
	// console.log(table);
	return table;
}