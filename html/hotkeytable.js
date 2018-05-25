chrome.storage.local.get("hotkeys", function(results) {
	var namecodemap;
	if (chrome.runtime.lastError || undefined === results['hotkeys']) {
		console.log('no hotkeys');
		// namecodemap = [
		// 	{ name: "取消或關閉", code: 99 },
		// 	{ name: "是", code: 121 },
		// 	{ name: "列印", code: 112 },
		// 	{ name: "聚焦證號欄", code: 93 },
		// 	{ name: "借還書作業", code: 39 },
		// 	{ name: "移轉寄送", code: 59 },
		// 	// { name: "關閉", code: 120 }
		// ]
		// chrome.storage.local.set({ "hotkeys": namecodemap });
	} else {
		$('#hotkeytable>tbody').empty();
		console.log(results['hotkeys'])
		namecodemap = results['hotkeys'];
	}
	namecodemap.forEach(e => {
		$('#hotkeytable>tbody').append(`<tr>
		            <th scope="row">${e.name}</th>
		            <td><input style:"color:black;" disabled maxlength = "1" size = "1px" type="text"  id="${e.name}" /></td>
		          </tr>`);
		$(`#${e.name}`)[0].value = String.fromCharCode(e.code);
	});
	document.getElementById('hotkeysetter').onchange = function() {
		if (this.checked === true) {
			console.log('switch on');
			$('#hotkeytable > tbody > tr > td > input').prop("disabled", true);
			var tds = $('#hotkeytable > tbody > tr > td > input').toArray();
			var zerostr = tds.filter(e => { return e.value.length !== 1 }).length;
			if (zerostr) {
				$('#hotkeysetter').bootstrapToggle('off');
				alert("empty string");
			} else {
				var maps = tds.map(e => {
					return { name: e.id, code: e.value.toLowerCase.charCodeAt(0) };
				})
				chrome.storage.local.set({ "hotkeys": maps });
			}
		} else {
			console.log('switch off');
			$('#hotkeytable > tbody > tr > td > input').prop("disabled", false);
		}
	};
});