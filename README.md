jcors-loader (v.1.1.0)
======================
Little tiny loader for javascript sources using CORS (only 1.2KB plane and 670B with Gzip)

Goals
------------------
- Load javascript files asynchronously in parallel.
- Execute javascript in order.
- Doesn't block window.onload or DOMContentLoaded. *
- Works in Safari, Chrome, Firefox, Opera, IE6+. *
- No loading indicators, the page looks done and whenever the script arrives.
- JSLint validation

\* The script works fine in IE 6/7 and Opera, but blocks onload and sources not load in parallel

[http://jcors-loader.herokuapp.com/test/](http://jcors-loader.herokuapp.com/test/index.html)

<img src="http://imageshack.us/a/img203/6493/screenshot20121008at123.png">

Really easy to use
------------------
- Include inline [jcors-loader.min.js](https://raw.github.com/pablomoretti/jcors-loader/master/src/jcors-loader.min.js).
- Enable CORS in your server if you are loading sources from other domain (cross-domain). *
- Tell JcorsLoader the url of the javascript resource you want to load or callback to execute.
- Enjoy it ;)

\* [How enable CORS ?](http://enable-cors.org/)

Example "One source with one callback"
----------------------------------
    
	JcorsLoader.load(
			"http://xxxx/jquery.min.js", 
			function() {
	        		$("#demo").html("jQuery Loaded");
			}
			);

Example "Multiple sources with multiple callbacks"
--------------------------------------------------
    
	JcorsLoader.load(
	    		"http://xxxx/jquery.min.js",
				function() {
	        		$("#demo").html("jQuery Loaded");
	    		},
	    		"http://xxxx/jquery.cookie.js",
	    		function() {  
	    			$.cookie('not_existing'); 
	    		}
	    		);


Test
----
require : node.js

- node tiny-http-server.js
- open http://localhost:8125/test/index.html


Build
-----
require : java

- make build


How do I contribute ?
---------------------
That is great! Just fork the project in github. Create a topic branch, write some code and send a pull request.

jcors-loader is licensed under the Apache Licence, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0.html)
