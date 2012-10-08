(function (document,window) {

		var _new_script = document.createElement("script");
		var _script = document.getElementsByTagName('script')[0];
		var _cors = createCORSRequest("about:blank") != null;
		var _undefined = "undefined";
		var _string = "string";
		var _buffer = [];

		function createCORSRequest(url){
		    var xhr = new XMLHttpRequest();
		    if ("withCredentials" in xhr){
		        xhr.open("get", url, true);
		    } else if (typeof XDomainRequest != _undefined){
		        xhr = new XDomainRequest();
		        xhr.open("get", url);
		    } else {
		        xhr = null;
		    }
		    return xhr;
		}

		function execute(script){
			if (typeof script === _string){
				var g = _new_script.cloneNode(true);
				g.text = script;
				_script.parentNode.insertBefore(g, _script);
			}else{
				script.apply(window);
			}
		}

		function executeInOrder(script,index){
			_buffer[index] = script;
			var e = true;
			for (var i = 0; i < _buffer.length; i++){
				if(typeof _buffer[i] == _undefined){
					e = false;
				}
				if(_buffer[i] != null && e){
					execute(_buffer[i]);
					_buffer[i] = null;
				}
	    	}
		}

		function loadScript(array){
			var scr = array.pop();
			if (typeof scr === _string){
				var s = _new_script.cloneNode(true);
				s.type = 'text/javascript';
				s.async = true;
				s.src = scr;
				if (_script.readyState) {
					s.onreadystatechange = function () {
						if (s.readyState === 'loaded' || s.readyState === 'complete') {
							s.onreadystatechange = null;
							if(array.length){
								loadScript(array);
							}
						}
					};
				}
				else{
					s.onload = function () {
						if(array.length){
							loadScript(array);
						}
					};
				}
				_script.parentNode.insertBefore(s, _script);
			}else{
				scr.apply(window);
				if(array.length){
					loadScript(array);
				}
			}
		}

    	window.JcorsLoader =  {
	        load: function () {
	            var params = arguments;
	            if(_cors){
	            	for (var i = 0; i < params.length; i++) {
		            	if (typeof params[i] === _string){
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