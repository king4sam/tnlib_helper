$('#booktable-tab').click(drawtable);

function drawtable() {
  chrome.storage.local.get('sendoutlist', function(results) {
    if (chrome.runtime.lastError || undefined === results['sendoutlist']) {
      console.log('no sendoutlist');
    } else {
      $('#commenttable>tbody').empty();
      $('#ctcap').empty = '';
      results['sendoutlist']['books'].forEach(function(e) {
        if (e[2].length !== 0) {
          addTableElement(e);
        }
      });
      document.getElementById('commenttable').style.display = 'table';
      let thattime = new Date(results['sendoutlist']['updatetime']);
      let updatetimeele = document.createElement('div');
      updatetimeele.setAttribute('id', 'lastupdate');
        let updatetime = document.createTextNode('最後更新 : '+ thattime.toLocaleDateString('zh-Hant-TW')+ thattime.toLocaleTimeString('zh-Hant-TW'));
        updatetimeele.appendChild(updatetime);
        let filenameele = document.createElement('div');
        filenameele.setAttribute('id', 'uploadfile');
        let filename = document.createTextNode('檔名' + results['sendoutlist']['filename']);
        filenameele.appendChild(filename);
        $('#ctcap').empty();
        document.getElementById('ctcap').appendChild(updatetimeele);
        document.getElementById('ctcap').appendChild(filenameele);
    }
  });
}

function addTableElement(book) {
  let url;
  if (book[3].length == 3) {
    url = 'http://163.26.71.106/webpac/content.cfm?mid=' +book[3][0]+'&m=ss&k0='+book[3][1] + '&t0=k&c0=and&list_num=10&current_page=' + book[3][2] + '&mt=&at=&sj=&py=&pr=&it=&lr=&lg=&si=';
  } else {
    url = 'http://163.26.71.106/webpac/content.cfm?mid=281325&m=ss&k0=ED0042189&t0=k&c0=and&si=&list_num=10&current_page=1&mt=&at=&sj=&py=&pr=&it=&lr=&lg=&si=1&contentlistcurrent_page=2&contentlist_num=10&lc=0&ye=&vo=&item_status_v=';
  }
  // var url'http://163.26.71.106/webpac/content.cfm?mid=' +book[3][0]+'&m=ss&k0='+book[3][1] + '&t0=k&c0=and&list_num=10&current_page=1&mt=&at=&sj=&py=&pr=&it=&lr=&lg=&si=&'
  $('#commenttable>tbody').append('<tr><th scope="row"><a target = "_blank" href = '+url+'>'+book[0]+'</a></th><td>'+book[1]+'</td><td>'+book[2]+'</td></tr>');
}

// drawtable();
