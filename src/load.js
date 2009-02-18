/**
 *	@fileoverview
 * Transform an SVG document in a FigureSet istance
 * @author Marco Cunico
 * @author Mirco Geremia
 */


/**
 * SVGReader
 * @constructor
 */
function SVGReader() {}


/**
 * Create an instance of FigureSet parsing an SVG document
 * @param {String} doc the name of the file SVG
 */
SVGReader.prototype.read = function (doc) {
  var psr = new XMLParser();
  var xmlDoc = psr.parsing(doc);
  if (xmlDoc == null)
	 return 1; // parsing error

  return 0;// xmlDoc contains the DOM of the SVG
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
