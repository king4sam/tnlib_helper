var SendMessagetoActiveTab = function(msg,cb){
	if(cb !== null || cb != undefined && typeof(cb) === 'function'){
		chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, msg,cb);
		});
	}
	else{
		chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, msg);
		});
	}	
}

var switchonchange = function() {
	if (this.checked === true) {
		console.log('switch on');
		var setting = {
			PropertySelection_0: opacele.value,
			itemCurrentStatusSelection: statusele.value
		}
		SendMessagetoActiveTab({ query: "lock", setting: setting });
		opacele.disabled = true;
		statusele.disabled = true;
		var selects = { status: "lock", setting: setting }
		chrome.storage.local.set({ "selects": selects }, function() {
			console.log('set');
		});

	} else {
		console.log('switch off');
		SendMessagetoActiveTab({ query: "release" });
		opacele.disabled = false;
		statusele.disabled = false;
		var selects = { status: "release" }
		chrome.storage.local.set({ "selects": selects }, function() {
			console.log('set');
		});
	}
}

$('#selectlocker').bootstrapToggle('off');
chrome.storage.local.get("selects", function(results) {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		console.log(tabs[0]);
		
		chrome.tabs.sendMessage(tabs[0].id, { query: "selects" }, function(response) {
			console.log(response);
			response.selects.forEach(e => {
				html = $.parseHTML(e);
				$('#selects').append(html);
			})
			var opacele = document.getElementById("PropertySelection_0");
			var statusele = document.getElementById("itemCurrentStatusSelection")
			if (chrome.runtime.lastError || undefined === results['selects']) {
				console.log('no selects');
			} else if (results['selects']['status'] === 'lock') {
				opacele.value = results['selects']['setting']['PropertySelection_0'];
				statusele.value = results['selects']['setting']['itemCurrentStatusSelection']
			}
			document.getElementById('selectlocker').onchange = function() {
				if (this.checked === true) {
					console.log('switch on');
					var setting = {
						PropertySelection_0: opacele.value,
						itemCurrentStatusSelection: statusele.value
					}
					SendMessagetoActiveTab({ query: "lock", setting: setting });
					opacele.disabled = true;
					statusele.disabled = true;
					var selects = { status: "lock", setting: setting }
					chrome.storage.local.set({ "selects": selects }, function() {
						console.log('set');
					});

				} else {
					console.log('switch off');
					SendMessagetoActiveTab({ query: "release" });
					opacele.disabled = false;
					statusele.disabled = false;
					var selects = { status: "release" }
					chrome.storage.local.set({ "selects": selects }, function() {
						console.log('set');
					});
				}
			}
			if (results['selects']['status'] === 'lock'){
				$('#selectlocker').bootstrapToggle('on');
			}
		});
	});
});