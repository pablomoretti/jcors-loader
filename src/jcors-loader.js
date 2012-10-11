(function (window) {
	'use strict';

	var document = window.document,
		node_createElementScript = document.createElement('script'),
		node_elementScript = document.getElementsByTagName('script')[0],
		isCORS = window.XDomainRequest || window.XMLHttpRequest || false,
		buffer = [],
		createCORSRequest = (function () {
			var xhr,
				CORSRequest;

			if (window.XMLHttpRequest) {
				xhr = new window.XMLHttpRequest();

				if (xhr.hasOwnProperty && xhr.hasOwnProperty('withCredentials')) {
					CORSRequest = function (url) {
						xhr = new window.XMLHttpRequest();
						xhr.open('get', url, true);

						return xhr;
					};
				} else {
					CORSRequest = function (url) {
						xhr = new window.XDomainRequest();
						xhr.open('get', url);

						return xhr;
					};
				}

				return CORSRequest;
			}

		}());

	function execute(script) {
		if (typeof script === 'string') {
			var g = node_createElementScript.cloneNode(true);
			g.text = script;
			node_elementScript.parentNode.insertBefore(g, node_elementScript);
		} else {
			script.apply(window);
		}
	}

	function executeInOrder(script, index) {
		buffer[index] = script;

		var e = true,
			i = 0,
			len = buffer.length;

		for (i; i < len; i += 1) {
			if (buffer[i] === undefined) {
				e = false;
			}

			if (buffer[i] !== null && e) {
				execute(buffer[i]);
				buffer[i] = null;
			}
		}
	}

	function loadsScriptsOnChain(scripts) {
		if (scripts.length) {
			var scr = scripts.pop(),
				script;

			if (typeof scr === 'string') {
				script = node_createElementScript.cloneNode(true);
				script.type = 'text/javascript';
				script.async = true;
				script.src = scr;
				script.onload = script.onreadystatechange = function () {
					if (!script.readyState || /loaded|complete/.test(script.readyState)) {
						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						// Dereference the script
						script = undefined;
						// Load
						loadsScriptsOnChain(scripts);
					}
				};
				node_elementScript.parentNode.insertBefore(script, node_elementScript);
			} else {
				scr.apply(window);
				loadsScriptsOnChain(scripts);
			}
		}
	}

	function onloadCORSHandler(request, index) {
		return function () {
			executeInOrder(request.responseText, index);
			// Dereference the script
			request = undefined;
		};
	}

	window.JcorsLoader =  {
		load: (function () {

			var load;

			if (isCORS) {
				load = function () {
					var params = arguments,
						i = 0,
						len = params.length,
						request;

					for (i; i < len; i += 1) {
						if (typeof params[i] === 'string') {
							request = createCORSRequest(params[i]);
							request.onload = onloadCORSHandler(request, i);
							request.send();
						} else {
							executeInOrder(params[i], i);
						}
					}
				};
			} else {
				load = function () { loadsScriptsOnChain(Array.prototype.slice.call(arguments, 0).reverse()); };
			}

			return load;
		}())
	};
}(this));