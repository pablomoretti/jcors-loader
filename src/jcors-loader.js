(function (document,window) {
		var _str_script = "script";
		var _str_undefined = "undefined";
		var _str_string = "string";
		var _str_get = "get";
		var _node_createElementScript = document.createElement(_str_script);
		var _node_elementScript = document.getElementsByTagName(_str_script)[0];
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

		function loadScript(array){
			if(typeof array !== _str_undefined){
				var scr = array.pop();
				if (typeof scr === _str_string){
					var s = _node_createElementScript.cloneNode(true);
					s.type = "text/javascript";
					s.async = true;
					s.src = scr;
					if (_node_elementScript.readyState) {
						s.onreadystatechange = function () {
							if (s.readyState === "loaded" || s.readyState === "complete") {
								s.onreadystatechange = null;
							}
						};
					}
					else{
						s.onload = function () {
								loadScript(array);
						};
					}
					_node_elementScript.parentNode.insertBefore(s, _node_elementScript);
				}else{
					scr.apply(window);
						loadScript(array);
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
								}
		      				})(i,request);
							request.send();
						}else{
							executeInOrder(params[i],i);
						}
	            	}
	            }else{
					loadScript(Array.prototype.slice.call(params, 0).reverse());
	            }
	        }
    	};
	}(document,window));