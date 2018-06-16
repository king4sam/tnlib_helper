var http = require('http');
var yakbak = require('yakbak');

http.createServer(yakbak('http://lib.tnml.tn.edu.tw', {
  dirname: __dirname + '/tapes',
  hash:function(req,body){
    var hash = 0;
    for (i = 0; i < req.url.length; i++) {
      char = req.url.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
})).listen(3000);