/**
 *	@fileoverview
 * Transform an SVG document in a FigureSet istance
 * @author Marco Cunico
 * @author Mirco Geremia
 */


/**
 * SVGReader create a figureSet and an elementRegistry
 * @constructor
 */
function SVGReader() {
}


function ParsingError (msg) {
  this._msg = msg;
}

ParsingError.reader('_msg', 'msg');

/**
 * Create an instance of FigureSet parsing an SVG document
 * @param {String} doc the name of the file SVG
 */
SVGReader.prototype.read = function (doc) {
  var fs = new FigureSet();
  var psr = new XMLParser();
  var xmlDoc = psr.parsing(doc);
  if (xmlDoc == null) {
    throw new ParsingError('Parsing Error');
  }

  var x = xmlDoc.getElementsByTagName("svg");
  for (var i = 0; i < x[0].childNodes.length; i++) {
    var n = x[0].childNodes[i];
    if (n.nodeName != "#text") {
      var f = registry.makeFigureClassFromTag(n.nodeName); // returns an instance of a figure
      // ignore unknow tags
      if (f != null) {
        f.fromSVG(n);
	fs.add(f);
      }
    }
  }

  return fs;
};


/**
 * XMLParser
 * @constructor
 */
function XMLParser() {}


/**
 * Check if it is a well-formed document
 * @param {String} doc the name fo the file SVG
 */
XMLParser.prototype.parsing = function (doc) {
  try { //Internet Explorer
	 var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	 xmlDoc.async = false;
	 xmlDoc.load(doc);

	 if (xmlDoc.parseError.errorCode != 0) {
		alert("Error in line " + xmlDoc.parseError.line +
				" position " + xmlDoc.parseError.linePos +
				"\nError Code: " + xmlDoc.parseError.errorCode +
				"\nError Reason: " + xmlDoc.parseError.reason +
				"Error Line: " + xmlDoc.parseError.srcText);
		return(null);
    }
  }
  catch(e) {
	 try { //Firefox
      var xmlDoc = document.implementation.createDocument("", "", null);
		xmlDoc.async = false;
		xmlDoc.load(doc);
		if (xmlDoc.documentElement.nodeName == "parsererror") {
		  alert(xmlDoc.documentElement.childNodes[0].nodeValue);
        return(null);
      }
    }
	 catch(e) {alert(e.message);}
  }
  try {
	 return (xmlDoc);
  }
  catch(e) {alert(e.message);}
  return (null);
};



/**
 * Contain the hash table
 * @constructor
 */
function SVGElementRegistry() {
  this._reg = {};
}


/**
 * Take a tag and return the corrispondent figure
 * @param {String} tag the name of the tag
 */
SVGElementRegistry.prototype.makeFigureClassFromTag = function (tag) {
  var fn = this._reg[tag];
  if (fn) {
    return new fn();
  }
  return null;
};

SVGElementRegistry.prototype.register = function (tagName, constructor) {
  this._reg[tagName] = constructor;
};

// unique instance of registry
var registry = new SVGElementRegistry();

registry.register('rect', Rectangle);
registry.register('ellipse', Circle);
registry.register('polygon', Polygon);
registry.register('path', BezierCurve);
register.register('text', Text);

//TODO: every class fromSVG method
