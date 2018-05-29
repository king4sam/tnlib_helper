chrome.storage.local.get("hotkeys", function(results) {
    var namecodemap;
    if (chrome.runtime.lastError || undefined === results['hotkeys']) {
        console.log('no hotkeys');
    } else {
        $('#hotkeytable>tbody').empty();
        console.log(results['hotkeys'])
        namecodemap = results['hotkeys'];
    }
    $('#hotkeytable>tbody').append(`<tr>
		            <th scope="row">清除</th>
		            <td>\\</td></tr>`);
    namecodemap.forEach(e => {
        $('#hotkeytable>tbody').append(`<tr>
		            <th scope="row">${e.name}</th>
		            <td><input style="color:black;" disabled maxlength = "1" size = "1px" type="text"  id="${e.name}" /></td>
		          </tr>`);
        $(`#${e.name}`)[0].value = String.fromCharCode(e.code);
    });
    document.getElementById('hotkeysetter').onchange = function() {
        if (this.checked === true) {
            console.log('switch on');
            $('#reset').css("display","none");
            $('#hotkeytable > tbody > tr > td > input').prop("disabled", true);
            var tds = $('#hotkeytable > tbody > tr > td > input').toArray();
            var zerostr = tds.filter(e => { return e.value.length !== 1 }).length;
            var maps = tds.map(e => {
                if (/[a-zA-Z]/.test(e.value)) {
                    return { name: e.id, code: e.value.toLowerCase().charCodeAt(0) };
                } else {
                    return { name: e.id, code: e.value.charCodeAt(0) };
                }

            })
            var set = new Set(tds.map(e => { return e.value }));
            if (zerostr) {
                $('#hotkeysetter').bootstrapToggle('off');
            } else if (set.size !== maps.length) {
                $('#hotkeysetter').bootstrapToggle('off');
            } else {
                $("#hotkeytable > tbody > tr > td > span").remove();
                chrome.storage.local.set({ "hotkeys": maps });
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { query: "reload" }, function(response) { console.log("sent") })
                });
            }
        } else {
            console.log('switch off');
            $('#reset').css("display","inline");
            $('#hotkeytable > tbody > tr > td > input').prop("disabled", false);
        }
    };
    $('#hotkeytable > tbody > tr > td > input').change(function() {
        this.value = this.value.toLowerCase();
        var tds = $('#hotkeytable > tbody > tr > td > input').toArray();
        var zerostr = tds.filter(e => { return e.value.length !== 1 });
        zerostr.forEach(e => {
           $(e.parentElement).append("<span class = 'empty' style= 'color: red;'>請輸入一個字母</span>")
        })
        var dup = findduptds(tds);
        dup.forEach(e => {
            $(e.parentElement).find(".duplicate").remove();
            $(e.parentElement).append("<span class = 'duplicate' style= 'color: red;'>重覆定義</span>")
        })
        zerostr.forEach(e => {
            tds.splice(tds.indexOf(e), 1);
        })
        dup.forEach(e => {
            tds.splice(tds.indexOf(e), 1);
        })
        tds.forEach(e => {
            $(e.parentElement).find("span").remove();
        })
    });
});

document.getElementById('reset').onclick = function() {
	var namecodemap = [
	{ name: "取消、關閉、否", code: 99 },
	{ name: "是、確定", code: 121 },
	{ name: "列印", code: 112 },
	{ name: "聚焦證號欄", code: 93 },
	{ name: "借還書作業", code: 39 },
	{ name: "移轉寄送", code: 59 },
	];
	var selects = { status: "release" };
	chrome.storage.local.set({ "hotkeys": namecodemap });
	chrome.storage.local.set({ "selects": selects });
    namecodemap.forEach(e => {
        $(`#${e.name}`)[0].value = String.fromCharCode(e.code);
    });
}

var findduptds = function(ary) {
    var appeared = [];
    var dup = [];
    ary.forEach(e => {
        if (appeared.filter(i => {
                return e.value == i.value;
            }).length == 0) {
            appeared.push(e);
        } else {
            dup.push(e);
        }
    });
    dup.forEach(e => {
        var ap = appeared.filter(i => {
            return e.value == i.value;
        });
        if (ap.length != 0) {
            dup.push(ap[0]);
            appeared.splice(appeared.indexOf(ap[0]), 1);
        }
    });
    return dup;
}