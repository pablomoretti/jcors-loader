jcors-loader (v.1.0.1)
======================
Little tiny loader for javascript sources using CORS (only 1.1KB plane and 647B with Gzip)

Goals
------------------
- Loads a javascript file asynchronously in parallel.
- Execute avascript in order.
- Doesn't block window.onload or DOMContentLoaded.
- Works in Safari, Chrome, Firefox, IE8+. *
- No loading indicators, the page looks done and whenever the script arrives.

The script works fine in IE 6/7 and Opera, but blocks onload and sources not load in parallel

[http://jcors-loader.herokuapp.com/test/](http://jcors-loader.herokuapp.com/test/index.html)

<img src="http://imageshack.us/a/img203/6493/screenshot20121008at123.png">

Really easy to use
------------------
- Include inline jcors-loader.min.js.
- Enable cors in your server if you are loading sources from other domains. *
- Tell JcorsLoader the url of the javascript resource you want to load or callback to execute.
- Enjoy it ;)

[enable-cors](http://enable-cors.org/)

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
- node tiny-http-server.js *
- open http://localhost:8125/test/index.html

require node.js

Build
-----
- make build *

require java

How do I contribute ?
---------------------
That is great! Just fork the project in github. Create a topic branch, write some code and send a pull request.

jcors-loader is licensed under the Apache Licence, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0.html)
