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

/**
 * Error manager
 * @param {String} msg the description of the error
 */
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


/**
 * Add a tag to the hashtable
 * @param {String} tagName the name of the tag
 * @param {Figure} constructor the figure corrisponding to the tag
 */
SVGElementRegistry.prototype.register = function (tagName, constructor) {
  this._reg[tagName] = constructor;
};

// unique instance of registry
var registry = new SVGElementRegistry();

registry.register('rect', Rectangle);
registry.register('ellipse', Circle);
registry.register('polygon', Polygon);
registry.register('line', StraightLine);
registry.register('path', BezierCurve);
registry.register('text', Text);


//TODO: every class fromSVG method
/**
 * Transform an svg node into a complete rectangle
 * @param {node} n the SVG node containg the property
 */
Rectangle.prototype.fromSVG = function (n) {
  var x1 = n.getAttribute("x");
  var y1 = n.getAttribute("y");
  var x2 = parseInt(x1) + parseInt(n.getAttribute("width"));
  var y2 = parseInt(y1) + parseInt(n.getAttribute("height"));
  var p1 = new Point(x1, y1);
  var p2 = new Point(x2, y2);
  this.getBounds().setStart(p1);
  this.getBounds().setEnd(p2);
  this.getFillColour().fromCSS(n.getAttribute("fill"));
  this.getFillColour().getOpacity().setVal(n.getAttribute("fill-opacity"));
  this.getBorderColour().fromCSS(n.getAttribute("stroke"));
  this.getBorderColour().getOpacity().setVal(n.getAttribute("stroke-opacity"));
  //this.draw(c);? or shall we draw all at the end?  how can i get canvas?
};


/**
 * Transform an svg node into an ellipse
 * @param {node} n the SVG node containg the property
 */
Circle.prototype.fromSVG = function (n) {
  var cx = n.getAttribute("cx");
  var cy = n.getAttribute("cy");
  var rx = n.getAttribute("rx");
  var ry = n.getAttribute("ry");
  var p1 = new Point((parseInt(cx) - parseInt(rx)), (parseInt(cy) - parseInt(ry)));
  var p2 = new Point((parseInt(cx) + parseInt(rx)), (parseInt(cy) + parseInt(ry)));
  this.getBounds().setStart(p1);
  this.getBounds().setEnd(p2);
  this.getFillColour().fromCSS(n.getAttribute("fill"));
  this.getFillColour().getOpacity().setVal(n.getAttribute("fill-opacity"));
  this.getBorderColour().fromCSS(n.getAttribute("stroke"));
  this.getBorderColour().getOpacity().setVal(n.getAttribute("stroke-opacity"));
  //this.draw(c);? or shall we draw all at the end?  how can i get canvas?
};



/**
 * Transform an svg node into a straight line
 * @param {node} n the SVG node containg the property
 */
StraightLine.prototype.fromSVG = function (n) {
  var x1 = n.getAttribute("x1");
  var y1 = n.getAttribute("y1");
  var x2 = n.getAttribute("x2");
  var y2 = n.getAttribute("y2");
  var p1 = new Point(x1, y1);
  var p2 = new Point(x2, y2);
  this.getBounds().setStart(p1);
  this.getBounds().setEnd(p2);
  this.getBorderColour().fromCSS(n.getAttribute("stroke"));
  this.getBorderColour().getOpacity().setVal(n.getAttribute("stroke-opacity"));
  //this.draw(c);? or shall we draw all at the end?  how can i get canvas?
};



/**
 * Transform an svg node into a polygon
 * @param {node} n the SVG node containg the property
 */
Polygon.prototype.fromSVG = function (n) {
  var x1 = n.getAttribute("x1");
  var y1 = n.getAttribute("y1");
  var x2 = n.getAttribute("x2");
  var y2 = n.getAttribute("y2");
  var p1 = new Point(x1, y1);
  var p2 = new Point(x2, y2);
  this.getBounds().setStart(p1);
  this.getBounds().setEnd(p2);
  var points = n.getAttribute("points");
  var edges = 0;
  for (var i = 0; i < points.length; ++i)
	if mid(stringa,i,1) = ","
		edges += 1;
  this.getEdgeNumber().setVal(edges);
  this.getFillColour().fromCSS(n.getAttribute("fill"));
  this.getFillColour().getOpacity().setVal(n.getAttribute("fill-opacity"));
  this.getBorderColour().fromCSS(n.getAttribute("stroke"));
  this.getBorderColour().getOpacity().setVal(n.getAttribute("stroke-opacity"));
  //this.draw(c);? or shall we draw all at the end?  how can i get canvas?
};
