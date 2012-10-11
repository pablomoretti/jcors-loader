// 2012 Pablo Moretti, https://github.com/pablomoretti/jcors-loader

!function (document, window) {

/* private */

	var JcorsLoader, // container
		_str_undefined = "undefined",
		_str_string = "string",
		_str_get = "get",
		_node_createElementScript = document.createElement("script"),
		_node_elementScript = document.getElementsByTagName("script")[0],
		_cors = createCORSRequest("about:blank") !== null,
		_buffer = [];

	function createCORSRequest(url) {
		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : null;
		if (xhr !== null && "withCredentials" in xhr){
			xhr.open(_str_get, url, true);
		} else if (typeof XDomainRequest != _str_undefined){
			xhr = new XDomainRequest();
			xhr.open(_str_get, url);
		} else {
			xhr = null;
		}
		return xhr;
	}

	function execute(script) {
		console.log(script)
		if (typeof script === _str_string) {
			var g = _node_createElementScript.cloneNode(true);
			g.text = script;
			_node_elementScript.parentNode.insertBefore(g, _node_elementScript);
		} else {
			script.apply(window);
		}
	}

	function executeInOrder(script,index) {
		_buffer[index] = script;
		var e = true;
		for (var i = 0; i < _buffer.length; i++) {
			if(typeof _buffer[i] == _str_undefined) {
				e = false;
			}
			if(_buffer[i] !== null && e) {
				execute(_buffer[i]);
				_buffer[i] = null;
			}
		}
	}

	function loadsScriptsOnChain(scripts) {
		if(scripts.length) {
			var scr = scripts.pop();
			if (typeof scr === _str_string) {
				var script = _node_createElementScript.cloneNode(true);
				script.type = "text/javascript";
				script.async = true;
				script.src = scr;
				script.onload = script.onreadystatechange = function() {
					if ( !script.readyState || /loaded|complete/.test( script.readyState ) ) {
						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						// Dereference the script
						script = undefined;
						// Load
						loadsScriptsOnChain(scripts);
					}
				};
			_node_elementScript.parentNode.insertBefore(script, _node_elementScript);
			} else {
				scr.apply(window);
				loadsScriptsOnChain(scripts);
			}
		}
	}

	function onloadCORSHandler(request,index) {
		return function() {
			executeInOrder(request.responseText,index);
			// Dereference the script
			request = undefined;
		};
	}

/* public */

	function load() {
		var params = arguments;
			if (_cors) {
			for (var index = 0; index < params.length; index++) {
				if (typeof params[index] === _str_string){
					request = createCORSRequest(params[index]);
					request.onload = onloadCORSHandler(request,index);
					request.send();
				} else {
					executeInOrder(params[index],index);
				}
			}
		} else {
			loadsScriptsOnChain(Array.prototype.slice.call(params, 0).reverse());
		}
	}

/* exports */

	JcorsLoader = { load: load };

	// If an AMD loader is present use AMD.
	// If a CommonJS loader is present use CommonJS.
	// Otherwise assign the 'JcorsLoader' object to the global scope.
	if (typeof define === 'function' && define.amd) {
		define(function () {
			return JcorsLoader;
		});
	} else if (typeof exports !== 'undefined') {
		exports.JcorsLoader = JcorsLoader;
	} else {
		window.JcorsLoader = JcorsLoader;
	}

}(document, window);