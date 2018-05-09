$('#booktable-tab').click(drawtable)

function drawtable(){
	chrome.storage.local.get("sendoutlist", function(books) {
		if (chrome.runtime.lastError ||  undefined === books['sendoutlist'] ) {
			console.log('no sendoutlist')
		} else {
			$('#commenttable>tbody').empty();
			books['sendoutlist'].forEach(function(e){
				if(e[2].length !== 0){
					add_table_element(e);
				}
			});
			document.getElementById('commenttable').style.display = 'table';
		}
	});
}

function add_table_element(book){
	var url = 'http://163.26.71.106/webpac/content.cfm?mid=' +book[3][0]+'&m=ss&k0='+book[3][1] + '&t0=k&c0=and&list_num=10&current_page=1&mt=&at=&sj=&py=&pr=&it=&lr=&lg=&si=&lc=' + book[3][2];
	$('#commenttable>tbody').append('<tr><th scope="row"><a target = "_blank" href = '+url+'>'+book[0]+'</a></th><td>'+book[1]+'</td><td>'+book[2]+'</td></tr>');
}

drawtable();