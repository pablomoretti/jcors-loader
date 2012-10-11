(function (document,window) {
		var _str_undefined = "undefined";
		var _str_string = "string";
		var _str_get = "get";
		var _node_createElementScript = document.createElement("script");
		var _node_elementScript = document.getElementsByTagName("script")[0];
		var _cors = createCORSRequest("about:blank") != null;
		var _buffer = [];

		function createCORSRequest(url){
		    var xhr = new XMLHttpRequest();
		    if ("withCredentials" in xhr){
		        xhr.open(_str_get, url, true);
		    } else if (typeof XDomainRequest != _str_undefined){
		        xhr = new XDomainRequest();
		        xhr.open(_str_get, url);
		    } else {
		        xhr = null;
		    }
		    return xhr;
		}

		function execute(script){
			if (typeof script === _str_string){
				var g = _node_createElementScript.cloneNode(true);
				g.text = script;
				_node_elementScript.parentNode.insertBefore(g, _node_elementScript);
			}else{
				script.apply(window);
			}
		}

		function executeInOrder(script,index){
			_buffer[index] = script;
			var e = true;
			for (var i = 0; i < _buffer.length; i++){
				if(typeof _buffer[i] == _str_undefined){
					e = false;
				}
				if(_buffer[i] != null && e){
					execute(_buffer[i]);
					_buffer[i] = null;
				}
	    	}
		}

		function loadsScriptsOnChain(scripts){
			if(scripts.length){
				var scr = scripts.pop();
				if (typeof scr === _str_string){
					var script = _node_createElementScript.cloneNode(true);
					script.type = "text/javascript";
					script.async = true;
					script.src = scr;
					// Attach handlers for all browsers
					script.onload = script.onreadystatechange = function() {
						if ( !script.readyState || /loaded|complete/.test( s.readyState ) ) {
							// Handle memory leak in IE
							script.onload = script.onreadystatechange = null;
							// Dereference the script
							script = undefined;
							// Load
							loadsScriptsOnChain(scripts);
						}
					};
					_node_elementScript.parentNode.insertBefore(script, _node_elementScript);
				}else{
					scr.apply(window);
					 loadsScriptsOnChain(scripts);
				}
			}
		}

    	window.JcorsLoader =  {
	        load: function () {
	            var params = arguments;
	            if(_cors){
	            	for (var i = 0; i < params.length; i++) {
		            	if (typeof params[i] === _str_string){
				            request = createCORSRequest(params[i]);
							request.onload = (function(i,request) {
								return function() {
								    	executeInOrder(request.responseText,i);
								    	// Dereference the script
										request = undefined;
								}
		      				})(i,request);
							request.send();
						}else{
							executeInOrder(params[i],i);
						}
	            	}
	            }else{
					 loadsScriptsOnChain(Array.prototype.slice.call(params, 0).reverse());
	            }
	        }
    	};
	}(document,window));