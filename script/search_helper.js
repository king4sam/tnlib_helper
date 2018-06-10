const MaxRetry = 10;
const host = 'http:\/\/163.26.71.106\/';
const webpac = 'webpac\/';
const search = 'webpac\/search.cfm';
const par1 = '?m=ss&k0=';
const par2 = '&t0=k&c0=and';
const SearchingHost = 'http://163.26.71.106';

let iserrpage = function( htmlDoc ) {
  let err = htmlDoc.querySelectorAll( 'img[alt="error_refresh"]' );
  if ( err.length > 0 ) {
    console.log( 'pageerr' );
    return true;
  } else {
    return false;
  }
};

Object.defineProperty( Promise, 'retry', {
  configurable: true,
  writable: true,
  value: function retry( retries, executor ) {
    // console.log(`${retries} retries left!`)

    if ( typeof retries !== 'number' ) {
      throw new TypeError( 'retries is not a number' );
    }

    const promise = new Promise( executor );

    if ( retries > 0 ) {
      return promise.catch( ( error ) => Promise.retry( --retries, executor ) );
    }

    return promise;
  },
} );

let tnlibxmlgetinit = function( url, book ) {
  let req = new XMLHttpRequest();
  req.open( 'GET', url );
  req.setRequestHeader( 'Accept', 'text/html' );
  req.setRequestHeader( 'Access-Control-Allow-Origin', SearchingHost );
  req.book = book;
  return req;
};

let nextpagepromise = function( link, book ) {
  console.log( link );
  return new Promise( function( resolve, reject ) {
    if ( link == '#' ) {
      console.log( 'booknotfound: ' + book[0] );

      // console.log('notfound');
      resolve( 'booknotfound' );
    } else {
      let req = tnlibxmlgetinit( host + webpac + link, book );
      req.onerror = function() {
        reject( Error( 'Network Error' ) );
      };
      let NextpageResponseHandler = function( res ) {
        if ( res.target.status == 200 ) {
          let htmlDoc = new DOMParser().parseFromString( res.target.response, 'text/html' );
          let links = htmlDoc.querySelectorAll( 'div[class="page_Num chg_page"]:nth-of-type(3) > a' );
          if ( iserrpage( htmlDoc ) ) {
            // reject(Error('errpage'));
            console.log( 'errpage' );
            console.log( res.target.responseURL );
            reject( Error( 'errpage' ) );
          }

          let nextlink = links[links.length - 1].getAttribute( 'href' );
          let tr = getbooktrs( htmlDoc, res.target.book );
          if ( tr.length !== 0 ) {
            resolve( res.target );
          } else {
            resolve( nextpagepromise( nextlink, book ) );
          }
        }
      };

      req.onload = NextpageResponseHandler;
      req.send();
    }
  } );
};

let getbooktrs = function( htmlDoc, book ) {
  if ( htmlDoc.querySelectorAll( '#rdk_content_1 >table > tbody > tr' ).length === 0 ) {
 return null;
} else {
    return Array.from( htmlDoc.querySelectorAll( '#rdk_content_1 >table > tbody > tr' ) )
      .filter( function( e ) {
        return e.children[0].innerText.trim() == book[0];
      } );
  }
};

let NormalAutolinkPromise = function( res ) {
  return Promise.retry( MaxRetry, function( resolve, reject ) {
    if ( res.target.status == 200 ) {
      let htmlDoc = new DOMParser().parseFromString( res.target.response, 'text/html' );
      if ( iserrpage( htmlDoc ) ) {
        // reject(Error('errpage'));
        // console.log('errpage');
        // console.log(res.target.responseURL)
        reject( Error( 'errpage' ) );
      }
      let links = htmlDoc.querySelectorAll( 'div[class="page_Num chg_page"]:nth-of-type(3) > a' );
      let tr = getbooktrs( htmlDoc, res.target.book );
      // let bookname = htmlDoc.getElementsByTagName( 'h2' )[1];
      let nextlink = links[links.length - 1].getAttribute( 'href' );
      console.log( nextlink );
      if ( tr.length !== 0 ) {
        resolve( res.target );
      } else {
        resolve( nextpagepromise( nextlink, res.target.book ) );
      }
    } else {
      reject( Error( 'Network Error' ) );
    }
  } );
};

let NormalSearchPromise = function( res ) {
  return Promise.retry( MaxRetry, function( resolve, reject ) {
    let htmlDoc = new DOMParser().parseFromString( res.target.response, 'text/html' );
    let autolink = htmlDoc.getElementById( 'autolink' );

    let req = tnlibxmlgetinit( host + webpac + autolink.getAttribute( 'href' ), res.target.book );
    req.onerror = function() {
      reject( Error( 'Network Error' ) );
    };

    let AutolinkResponseHandler = function( res ) {
      if ( res.target.status == 200 ) {
        let htmlDoc = new DOMParser().parseFromString( res.target.response, 'text/html' );
        if ( iserrpage( htmlDoc ) ) {
          // reject(Error('errpage'));
          console.log( 'errpage' );
          console.log( res.target.responseURL );
        }
        resolve( res );
      } else {
        reject( Error( 'Network Error' ) );
      }
    };
    req.onload = AutolinkResponseHandler;
    req.send();
  } );
};

let getbookpage = function( book ) {
  return Promise.retry( MaxRetry, function( resolve, reject ) {
    let SearchResponseHandler = function( res ) {
      let parser = new DOMParser();
      let htmlDoc = parser.parseFromString( res.target.response, 'text/html' );
      let autolink = htmlDoc.getElementById( 'autolink' );
      if ( res.target.status == 200 ) {
        if ( iserrpage( htmlDoc ) || autolink === null ) {
          // reject(Error('errpage'));
          // console.log('errpage');
          // console.log(res.target.responseURL);
          reject( 'noautolink' );
        } else {
          resolve( res );
        }

        // Resolve the promise with the response text
      } else {
        reject( Error( 'Network Error' ) );
      }
    };
    let req = tnlibxmlgetinit( host + search + par1 + book[0] + par2, book );
    req.onload = SearchResponseHandler;

    req.onerror = function() {
      reject( Error( 'Network Error' ) );
    };

    req.send();
  } ).then( NormalSearchPromise )
    .then( NormalAutolinkPromise )
    .catch( ( err ) => {
      // console.log('caught ') ;
      // console.log(err);
      return 'errpage';
    } );
};
