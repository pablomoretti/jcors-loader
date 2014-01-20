// 2012 Pablo Moretti, https://github.com/pablomoretti/jcors-loader

(function (window) {

	'use strict';

	/* private */

	var document = window.document,
		node_createElementScript = document.createElement('script'),
		node_elementScript = document.getElementsByTagName('script')[0],
		buffer = [],
		lastBufferIndex = 0,
		processingBuffer = false,
		createCORSRequest = (function () {
			var xhr,
				CORSRequest;
			if (window.XMLHttpRequest) {
				xhr = new window.XMLHttpRequest();
				if ("withCredentials" in xhr) {
					CORSRequest = function (url) {
						xhr = new window.XMLHttpRequest();
						xhr.open('get', url, true);
						return xhr;
					};
				} else if (window.XDomainRequest) {
					CORSRequest = function (url) {
						xhr = new window.XDomainRequest();
						xhr.open('get', url);
						return xhr;
					};
				}
			}
			return CORSRequest;
		}());

	function execute(script) {
		if (typeof script === 'string') {
			var g = node_createElementScript.cloneNode(false);
			g.text = script;
			node_elementScript.parentNode.insertBefore(g, node_elementScript);
		} else {
			script.apply(window);
		}
	}

	function saveInBuffer(index, script) {
		
		buffer[index] = script;
	}

	function finishedTask(index) {
		saveInBuffer(index, null);
		lastBufferIndex = index+1;
	}

	function executeBuffer() {
		var dep = true,
			script,
			index = lastBufferIndex,
			len = buffer.length;

		if( !processingBuffer ) {
			processingBuffer = true
		} else {
			setTimeout(executeBuffer, 500);
			return;
		}

		while (index < len && dep) {
			script = buffer[index];
			if (script !== undefined && script !== null) {
				execute(script);
				
				finishedTask(index);
				index += 1;
				
			} else {
				dep = false;
			}
		}
		processingBuffer = false
	}

	function loadsAndExecuteScriptsOnChain() {
		if (buffer.length) {
			var scr = buffer.pop(),
				script;
			if (typeof scr === 'string') {
				script = node_createElementScript.cloneNode(true);
				script.type = "text/javascript";
				script.async = true;
				script.src = scr;
				script.onload = script.onreadystatechange = function () {
					if (!script.readyState || /loaded|complete/.test(script.readyState)) {
						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						// Dereference the script
						script = undefined;
						// Load
						loadsAndExecuteScriptsOnChain();
					}
				};
				node_elementScript.parentNode.insertBefore(script, node_elementScript);
			} else {
				scr.apply(window);
				loadsAndExecuteScriptsOnChain();
			}
		}
	}

	function onloadCORSHandler(request, index) {
		return function () {
			saveInBuffer(index, request.responseText);
			executeBuffer();
			// Dereference the script
			request = undefined;
		};
	}

	/* public */

	function loadWithCORS() {
		var len = arguments.length,
			index,
			request;
		for (index = 0; index < len; index += 1) {
			if (typeof arguments[index] === 'string') {
				request = createCORSRequest(arguments[index]);
				request.onload = onloadCORSHandler(request, buffer.length);
				saveInBuffer(buffer.length, null);
				request.send();
			} else {
				saveInBuffer(buffer.length, arguments[index]);
				executeBuffer();
			}
		}
	}

	function loadWihtOutCORS() {
		buffer.push(Array.prototype.slice.call(arguments, 0).reverse());
		loadsAndExecuteScriptsOnChain();
	}

	/* exports */

	window.JcorsLoader =  { load: (createCORSRequest ? loadWithCORS  : loadWihtOutCORS)};

}(window));