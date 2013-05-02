var lc = lc || {}; 

/*
	Get the coords for the currently selected codemirror token.

	@param {object} cm The CodeMirror instance.
	@param {Number} start The selection start.
	@param {Number} end The selection end.
	@return {object} The coords object.
*/
lc.getTokenCoords = function(cm, start, end) {

	// select token
	cm.setSelection(start, end);

	// find coords at token start
	var startCoords = cm.cursorCoords(true);
	var endCoords = cm.cursorCoords(false);

	// center marker on token
	var center = startCoords.left + (endCoords.left - startCoords.left)/2;

	return { x: center, y: startCoords.top };

};

lc.replaceSnippet = function(cm) {

	var cursor = cm.getCursor();
	var line = cursor.line;
	var ch = cursor.ch;

	var token = cm.getTokenAt({line: line, ch: ch});

	// is there a snippet for this keyword?
	var snippet = _.find(lc.snippets, function(value) {
		return value.keyword == token.string;
	});

	var currentMode = modes.getCurrent();

	// if we found a snippet, replace it only if we're on the right mode
	if (snippet && currentMode.name == snippet.mode) {
		cm.replaceRange(snippet.snippet, {line: line, ch: ch - token.string.length}, {line: line, ch: ch});
	}

};

lc.codeMirrorInit = function(element, extraKeys) {

	// create codemirror instance
	var cm = CodeMirror(element.get(0), {

		// this object holds a reference to extra keys
		extraKeys: extraKeys,

		// show line numbers
		lineNumbers: true,

		matchBrackets: true,

		// auto close brackets
		autoCloseBrackets: true,

		// set default mode to javascript
		mode:  'text/javascript',

		// set the theme (a decent twilight-lookalike)
		theme: 'lesser-dark'
	});

	// listen for a change in the codemirror's contents
	cm.on('change', function(cm, changeObj) {

		// if aigua.pause is true, don't do anything when the code changes
		if (!aigua.pause) {

			// if we've modified the code, set the 'dirty' flag (the green dot)
			// but don't do that when we're loading the code
			if (!aigua.isLoading) {
				aigua.setToDirty();
			}

			// call render code every time we change the code's contents
			// this will re-render the code contents and display the results
			// on the display panel
			aigua.renderCode();
		}

	});

	return cm;

};














