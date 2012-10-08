var http = require('http');
var fs = require('fs');
var path = require('path');
 
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
   
        path.exists(filePath, function(exists) {
         
            if (exists) {
                fs.readFile(filePath, function(error, content) {
                    if (error) {
                        response.writeHead(500);
                        response.end();
                    }
                    else {
                        response.setHeader('Content-Type', contentType);
                        response.setHeader('Access-Control-Allow-Origin', '*' );
                        response.writeHead(200);
                        response.end(content, 'utf-8');
                    }
                });
            }
            else {
                response.writeHead(404);
                response.end();
            }
        });

    }, sleep);
     
}).listen(8125);
 
console.log('Server running at http://127.0.0.1:8125/');