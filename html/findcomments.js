import SearchHelper from '../script/search_helper.js'

document.getElementById('fileConfirm-btn1').addEventListener('click', findBooksHandler);

function allProgress(proms, progresscb) {
    let d = 0;
    progresscb(0);
    proms.forEach((p) => {
        p.then(() => {
            d++;
            progresscb((d * 100) / proms.length);
        });
    });
    return Promise.all(proms);
}

function findBooksHandler(event) {
    let file = document.getElementById('fileForUpload1').files[0];
    if (file) {
        let pb =
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
        let reader = new FileReader();
        reader.readAsText(file, 'big5');
        reader.onload = function(evt) {
            let arys = Papa.parse(evt.target.result);
            let results = arys.data.slice(6).map(function(e) {
                return [e[6], e[9]];
            }).filter(function(e) {
                return undefined !== e[0] && e[0].length !== 0;
            });
            allProgress(
                results.map(function(e) {
                    let sh = new SearchHelper("http://163.26.71.106/");
                    return sh.getbookpage(e);
                }), (p) => {
                    // console.log(p);
                    $('#spb')[0].style.width = p.toFixed(2) + '%';
                    $('#spb')[0].setAttribute('aria-valuenow', p.toFixed(2));
                    $('#spb')[0].innerText = p.toFixed(2) + '%';
                    // console.log(`% Done = ${p.toFixed(2)}`);
                }).then(storeBooks);
        };
        reader.onerror = function(evt) {
            document.getElementById('fileContents').innerHTML = '上傳失敗';
        };
    } else {
        console.log('no file selected');
    }
}

function extractUrlPars(pages) {
    console.log(pages);
    $('#spb_container').remove();
    let foundpages = pages.filter((p) => {
        return p !== 'booknotfound' && p !== 'errpage';
    });
    console.log(foundpages);
    let books = foundpages.map(function(page) {
        // console.log(page);
        // console.log(page.responseURL);
        let parser = new DOMParser();
        let htmlDoc = parser.parseFromString(page.response, 'text/html');
        let extract = function(responseURL) {
            // content.cfm?mid=281325&m=ss&k0=ED0042189&t0=k&c0=and&si=&list_num=10&current_page=1&mt=&at=&sj=&py=&pr=&it=&lr=&lg=&si=1&contentlistcurrent_page=2&contentlist_num=10&lc=0&ye=&vo=&item_status_v=
            let regex = /http:\/\/163\.26\.71\.106\/webpac\/content\.cfm\?mid=(\d+)&m=ss&k0=([A-Z]{2}\d+|\d+)&t0=k&c0=and&list_num=10&current_page=(\d+)&mt=&at=&sj=&py=&pr=&it=&lr=&lg=&si=/gm;;
            let m;
            while ((m = regex.exec(responseURL)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                // The result can be accessed through the `m`-variable.

                return m.slice(1);
            }
        };
        let extract1 = function(responseURL) {
            // content.cfm?mid=281325&m=ss&k0=ED0042189&t0=k&c0=and&si=&list_num=10&current_page=1&mt=&at=&sj=&py=&pr=&it=&lr=&lg=&si=1&contentlistcurrent_page=2&contentlist_num=10&lc=0&ye=&vo=&item_status_v=
            let regex1 = /http:\/\/163\.26\.71\.106\/webpac\/content\.cfm\?mid=(\d+)&m=ss&k0=([A-Z]{2}\d+|\d+)&t0=k&c0=and&list_num=10&current_page=(\d+)&mt=&at=&sj=&py=&pr=&it=&lr=&lg=&si=1&contentlistcurrent_page=(\d+)&contentlist_num=10&lc=0&ye=&vo=&item_status_v=/gm;
            let m1;
            while ((m1 = regex1.exec(responseURL)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                // The result can be accessed through the `m`-variable.
                if (m1.length > 0) {
                    return m1.slice(1);
                }
            }
        };
        let extract2 = function(responseURL) {
            const regex = /http:\/\/163\.26\.71\.106\/webpac\/content\.cfm\?mid=(\d+)&m=ss&k0=([A-Z]{2}\d+|\d+)&t0=k&c0=and/gm;
            let m;
            while ((m = regex.exec(responseURL)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                // The result can be accessed through the `m`-variable.

                return m.slice(1);
            }
        };
        let tr = Array(...htmlDoc.querySelectorAll('#rdk_content_1 >table > tbody > tr'))
            .filter(function(e) {
                return e.children[0].innerText.trim() == page.book[0];
            });

        if (tr.length !== 0 && tr[0].children[8].innerText.trim().length > 0) {
            return [page.book[0], page.book[1], tr[0].children[8].innerText.trim(), extract(page.responseURL) || extract1(page.responseURL) || extract2(page.responseURL)];
        } else {
            return [page.book[0], page.book[1], '', extract(page.responseURL) || extract1(page.responseURL) || extract2(page.responseURL)];
        }
    });

    let sortedbooks = books // .filter(function(e){ return e[1][0] == 'J' })
        .sort(function(a, b) {
            let x = 0;
            while (x < a[1].length && x < b[1].length) {
                if (a[1][x] != b[1][x]) {
                    return a[1].charCodeAt(x) - b[1].charCodeAt(x);
                }
                x++;
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
    var sbooks = extractUrlPars(books)

    let sendoutlist = {
        'updatetime': new Date().toString(),
        'books': sbooks,
        'filename': document.getElementById('fileForUpload1').files[0]['name'],
    };

    console.log(sendoutlist);
    return new Promise(function(resolve, reject) {
        chrome.storage.local.set({ 'sendoutlist': sendoutlist }, function() {
            console.log('set');
            $('#booktable-tab').click();
            resolve('set');
        });
    });
}