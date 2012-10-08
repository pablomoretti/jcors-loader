var http = require('http');
var fs = require('fs');
var path = require('path');
var util = require('util');
var mu   = require('mu2');

var port = process.env.PORT || 8125;

http.createServer(function (request, response) {
    
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.htm';
         
    var extname = path.extname(filePath);
    var contentType = 'text/plain';
    var sleep = 50;
    switch (extname) {
        case '.js':
            sleep = 200;
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.html':
            contentType = 'text/html';
            break;
        case '.png':
            contentType = 'image/png';
            break;
    }

    setTimeout(function() {

        fs.readFile('./src/jcors-loader.js', 'utf8', function (err,data) {
   
            path.exists(filePath, function(exists) {
             
                if (exists) {

                    response.setHeader('Content-Type', contentType);
                    response.setHeader('Access-Control-Allow-Origin', '*' );
                    response.writeHead(200);

                    var readStream = null
                    if(contentType == 'text/html'){
                        readStream = mu.compileAndRender(filePath, {jcorsLoaderLib: data,env:process.env.PORT});
                    }else{
                        readStream = fs.createReadStream(filePath);
                    }

                    readStream.on('data', function(data) {
                        response.write(data);
                    });
                    readStream.on('end', function() {
                        response.end();        
                    });

                }
                else {
                    response.writeHead(404);
                    response.end();
                }
            });

        });

    }, sleep);
     
}).listen(port);
 
console.log('Server running at http://127.0.0.1:'+port+'/');