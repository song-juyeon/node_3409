const http = require('http');
const fs = require("fs");
const url = require('url');

const app = http.createServer(function (req, res){
    let _url = req.url;  //url에 '/'뒷부분
    let queryData = url.parse(_url, true).query;

    res.end(queryData.id);

});



app.listen(3333);