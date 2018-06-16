import SearchHelper from '../script/search_helper.js';

function allProgress(proms, progresscb) {
  let d = 0;
  progresscb(0);
  proms.forEach((p) => {
    p.then(() => {
      d += 1;
      progresscb((d * 100) / proms.length);
    });
  });
  return Promise.all(proms);
}


function extractUrlPars(pages) {
  console.log(pages);
  $('#spb_container').remove();
  const foundpages = pages.filter(p => p !== 'booknotfound' && p !== 'errpage');
  console.log(foundpages);
  const books = foundpages.map((page) => {
    // console.log(page);
    // console.log(page.responseURL);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(page.response, 'text/html');
    const extract = function (responseURL) {
      // content.cfm?mid=281325&m=ss&k0=ED0042189&t0=k&c0=and&si=&list_num=10&current_page=1&mt=&at=&sj=&py=&pr=&it=&lr=&lg=&si=1&contentlistcurrent_page=2&contentlist_num=10&lc=0&ye=&vo=&item_status_v=
      const regex = /http:\/\/163\.26\.71\.106\/webpac\/content\.cfm\?mid=(\d+)&m=ss&k0=([A-Z]{2}\d+|\d+)&t0=k&c0=and&list_num=10&current_page=(\d+)&mt=&at=&sj=&py=&pr=&it=&lr=&lg=&si=/gm;
      let m = regex.exec(responseURL);
      while (m !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex += 1;
        }
        if (m.length > 0) {
          return m.slice(1);
        }
        m = regex.exec(responseURL);
      }
      return undefined;
    };
    const extract1 = function (responseURL) {
      // content.cfm?mid=281325&m=ss&k0=ED0042189&t0=k&c0=and&si=&list_num=10&current_page=1&mt=&at=&sj=&py=&pr=&it=&lr=&lg=&si=1&contentlistcurrent_page=2&contentlist_num=10&lc=0&ye=&vo=&item_status_v=
      const regex = /http:\/\/163\.26\.71\.106\/webpac\/content\.cfm\?mid=(\d+)&m=ss&k0=([A-Z]{2}\d+|\d+)&t0=k&c0=and&list_num=10&current_page=(\d+)&mt=&at=&sj=&py=&pr=&it=&lr=&lg=&si=1&contentlistcurrent_page=(\d+)&contentlist_num=10&lc=0&ye=&vo=&item_status_v=/gm;
      let m;
      while (m !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex += 1;
        }
        if (m.length > 0) {
          return m.slice(1);
        }
        m = regex.exec(responseURL);
      }
      return undefined;
    };
    const extract2 = function (responseURL) {
      const regex = /http:\/\/163\.26\.71\.106\/webpac\/content\.cfm\?mid=(\d+)&m=ss&k0=([A-Z]{2}\d+|\d+)&t0=k&c0=and/gm;
      let m;
      while (m !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex += 1;
        }
        if (m.length > 0) {
          return m.slice(1);
        }
        m = regex.exec(responseURL);
      }
      return undefined;
    };
    const tr = Array(...htmlDoc.querySelectorAll('#rdk_content_1 >table > tbody > tr'))
      .filter(e => e.children[0].innerText.trim() === page.book[0]);

    if (tr.length !== 0 && tr[0].children[8].innerText.trim().length > 0) {
      return [page.book[0], page.book[1], tr[0].children[8].innerText.trim(), extract(page.responseURL) || extract1(page.responseURL) || extract2(page.responseURL)];
    }
    return [page.book[0], page.book[1], '', extract(page.responseURL) || extract1(page.responseURL) || extract2(page.responseURL)];
  });

  const sortedbooks = books // .filter(function(e){ return e[1][0] == 'J' })
    .sort((a, b) => {
      let x = 0;
      while (x < a[1].length && x < b[1].length) {
        if (a[1][x] !== b[1][x]) {
          return a[1].charCodeAt(x) - b[1].charCodeAt(x);
        }
        x += 1;
      }
      return a[1].length - b[1].length;
    });

  console.log(sortedbooks);

  document.getElementById('fileConfirm-btn1').style.display = 'inline-block';
  document.getElementById('fileForUpload1').style.display = 'inline-block';
  document.getElementById('closebtn1').style.display = 'inline';
  document.getElementById('commenttable').style.display = 'table';

  return sortedbooks;
}

function storeBooks(books) {
  const sbooks = extractUrlPars(books);

  const sendoutlist = {
    updatetime: new Date().toString(),
    books: sbooks,
    filename: document.getElementById('fileForUpload1').files[0].name,
  };

  console.log(sendoutlist);
  return new Promise(((resolve, reject) => {
    chrome.storage.local.set({ sendoutlist }, () => {
      console.log('set');
      $('#booktable-tab').click();
      resolve('set');
    });
  }));
}

function findBooksHandler(event) {
  const file = document.getElementById('fileForUpload1').files[0];
  if (file) {
    const pb =
            `<div id = "spb_container" class="container">
            <h4>查詢中，請稍候</h4>
            <div class="progress">
              <div id = "spb" class="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%">
                0%
              </div>
            </div>
          </div>`;
    $('#fileConfirm-btn1').after(pb);

    document.getElementById('fileForUpload1').style.display = 'none';
    document.getElementById('fileConfirm-btn1').style.display = 'none';
    const reader = new FileReader();
    reader.readAsText(file, 'big5');
    reader.onload = function (evt) {
      const arys = window.Papa.parse(evt.target.result);
      const results = arys.data.slice(6).map(e => [e[6], e[9]]).filter(e => undefined !== e[0] && e[0].length !== 0);
      allProgress(results.map((e) => {
        const sh = new SearchHelper('http://163.26.71.106/');
        return sh.getbookpage(e);
      }), (p) => {
        // console.log(p);
        $('#spb')[0].style.width = `${p.toFixed(2)}%`;
        $('#spb')[0].setAttribute('aria-valuenow', p.toFixed(2));
        $('#spb')[0].innerText = `${p.toFixed(2)}%`;
        // console.log(`% Done = ${p.toFixed(2)}`);
      }).then(storeBooks);
    };
    reader.onerror = function (evt) {
      Error(evt);
      document.getElementById('fileContents').innerHTML = '上傳失敗';
    };
  } else {
    console.log('no file selected');
  }
}

document.getElementById('fileConfirm-btn1').addEventListener('click', findBooksHandler);
