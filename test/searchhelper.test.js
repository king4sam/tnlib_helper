import search_helper from 'script/search_helper.js';

describe("search_helper.js" , () => {
  describe("getbook", () => {
    let sh = new search_helper("http://localhost:3000/");
    it ("should return the page of queried book", (done)=>{
      sh.getbookpage(["ED0105559"]).then((rs)=>{
        // console.log(rs);
        console.log(rs.responseURL);
        let htmlDoc = new DOMParser().parseFromString( rs.response, 'text/html' );
        let links = htmlDoc.querySelectorAll( 'div[class="page_Num chg_page"]:nth-of-type(3) > a' );
        let tr = sh.getbooktrs( htmlDoc, ["ED0105559"] );
        expect(tr.length).toBeGreaterThan(0);
        done();
      })
    });
  })

  describe("booknotfound", () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    let sh = new search_helper("http://localhost:3000/");
    it ("should return errpage", (done)=>{
      sh.getbookpage(["ED12"]).then((rs)=>{
        // console.log(rs);
        expect(rs).toBe("errpage");
        done();
      })
    });
  })
})
