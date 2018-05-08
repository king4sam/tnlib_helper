document.getElementById('closebtn').addEventListener('click', function() { window.close() });
document.getElementById('fileConfirm-btn').addEventListener('click', file_viewer_load);

function file_viewer_load(event) {
	document.getElementById('fileForUpload');
	var file = document.getElementById('fileForUpload').files[0];
	if (file) {
		document.getElementById('fileForUpload');
		var reader = new FileReader();
		reader.readAsText(file, "big5");
		reader.onload = function(evt) {
			var arys = Papa.parse(evt.target.result);
			var result = arys.data.filter(record => record[7] === '3-安定區圖書館(BTR)' && record[8].includes('安定')).map(function(e) { return e[9] });
			console.log(result);
			chrome.storage.local.set({ "reservedbooks": result }, function() {
				console.log("set");
				document.getElementById("fileContents").innerHTML = '更新完成';
				document.getElementById('fileConfirm-btn').remove();
				document.getElementById('fileForUpload').remove();
				document.getElementById('closebtn').style.display = 'inline';
			});
		}
		reader.onerror = function(evt) {
			document.getElementById("fileContents").innerHTML = "上傳失敗";
		}
	}
}
// var script = document.createElement('script');
// script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';
// script.type = 'text/javascript';
// document.getElementsByTagName('head')[0].appendChild(script);