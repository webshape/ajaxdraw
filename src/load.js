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
      if (f !== null) {
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
 * @param {String} doc the SVG string
 */
XMLParser.prototype.parsing = function (doc) {
  var xmlDoc = null;
  try { //Internet Explorer
	 xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	 xmlDoc.async = false;
     xmlDoc.load(doc);
	 /*xmlDoc.loadXML(doc);*/

	 if (xmlDoc.parseError.errorCode !== 0) {
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
		/*var parser = new DOMParser();
		xmlDoc = parser.parseFromString(doc, "text/xml");*/
        xmlDoc=document.implementation.createDocument("","",null);
        xmlDoc.async="false";
        xmlDoc.load(doc);
		if (xmlDoc.documentElement.nodeName == "parsererror") {
		  alert(xmlDoc.documentElement.childNodes[0].nodeValue);
        return(null);
      }
    }
	 catch(e2) {alert(e2.message);}
  }
  try {
	 return (xmlDoc);
  }
  catch(e3) {alert(e3.message);}
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
	 if (tag == 'text')
		return new fn(new TextString("canvas"));
	 else
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
registry.register('line', StraightLine);
registry.register('path', BezierCurve);
registry.register('polygon', Polygon);
registry.register('text', Text);



/**
 * Transform an svg node into a complete rectangle
 * @param {node} n the SVG node containg the properties
 */
Rectangle.prototype.fromSVG = function (n) {
  var x1 = n.getAttribute("x");
  if(isNaN(x1))
 {
    alert("Solo valori numerici");
 }
  var y1 = n.getAttribute("y");

 if((n.getAttribute("width"))<0)
 {
    alert("Il valore di width non puo' essere negativo");
 }

 if((n.getAttribute("height"))<0)
 {
    alert("Il valore di height non puo' essere negativo");
 }

  var x2 = parseInt(x1, 10) + parseInt(n.getAttribute("width"), 10);
  var y2 = parseInt(y1, 10) + parseInt(n.getAttribute("height"), 10);
  var p1 = new Point(parseInt(x1, 10), parseInt(y1, 10));
  var p2 = new Point(x2, y2);
  this.getBounds().setStart(p1);
  this.getBounds().setEnd(p2);

  var stringa = n.getAttribute("fill");
  var sottostringa = stringa.substr(0,1);
  if (sottostringa != "#")
      alert("manca il # prima del valore esadecimale di fill")

  var errorEx = /^#?[\dabcdef]{6}$/gi;
  if(!(errorEx.test(n.getAttribute("fill"))))
    alert("Il valore di fill non e' un valore esadecimale valido");
  this.getFillColour().fromCSS(n.getAttribute("fill"));

  if (((n.getAttribute("fill-opacity"))<=0) || ((n.getAttribute("fill-opacity"))>=1 ))
      alert("il valore di fill-opacity non e' un valore valido \n (un valore valido e' compreso tra 0 e 1)")

  this.getFillColour().getOpacity().setVal(n.getAttribute("fill-opacity"));
  this.getBorderColour().fromCSS(n.getAttribute("stroke"));
  this.getBorderColour().getOpacity().setVal(n.getAttribute("stroke-opacity"));
  //this.draw(c);? or shall we draw all at the end?  how can i get canvas?
};


/**
 * Transform an svg node into an ellipse
 * @param {node} n the SVG node containg the properties
 */
Circle.prototype.fromSVG = function (n) {
  var cx = n.getAttribute("cx");
  var cy = n.getAttribute("cy");
  var rx = n.getAttribute("rx");
  var ry = n.getAttribute("ry");
  var p1 = new Point((parseInt(cx, 10) - parseInt(rx, 10)), (parseInt(cy, 10) - parseInt(ry, 10)));
  var p2 = new Point((parseInt(cx, 10) + parseInt(rx, 10)), (parseInt(cy, 10) + parseInt(ry, 10)));
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
 * @param {node} n the SVG node containg the properties
 */
StraightLine.prototype.fromSVG = function (n) {
  var x1 = n.getAttribute("x1");
  var y1 = n.getAttribute("y1");
  var x2 = n.getAttribute("x2");
  var y2 = n.getAttribute("y2");
  var p1 = new Point(parseInt(x1, 10), parseInt(y1, 10));
  var p2 = new Point(parseInt(x2, 10), parseInt(y2, 10));
  this.getBounds().setStart(p1);
  this.getBounds().setEnd(p2);
  this.getBorderColour().fromCSS(n.getAttribute("stroke"));
  this.getBorderColour().getOpacity().setVal(n.getAttribute("stroke-opacity"));
  //this.draw(c);? or shall we draw all at the end?  how can i get canvas?
};


/**
 * Transform an svg node into a bezier curve
 * @param {node} n the SVG node containg the properties
 */
BezierCurve.prototype.fromSVG = function (n) {
  var d = [];
  d = (n.getAttribute("d")).split(" ");

  for (var i = 0; i < d.length; i++){
	 if (d[i].length > 1){
		var x = [];
		x = d[i].split(",");
	   var p = new Point(parseInt(x[0], 10), parseInt(x[1], 10));
		this.extend(p);
	 }
  }
  this.getBorderColour().fromCSS(n.getAttribute("stroke"));
  this.getBorderColour().getOpacity().setVal(n.getAttribute("stroke-opacity"));
  //this.draw(c);? or shall we draw all at the end?  how can i get canvas?
};


/**
 * Transform an svg node into a polygon
 * @param {node} n the SVG node containg the property
 */
Polygon.prototype.fromSVG = function (n) {
  var points = [];
  points = (n.getAttribute("points")).split(" ");

  var z = [];
  z = points[0].split(",");
  var x1 = parseInt(z[0], 10);
  var y1 = parseInt(z[1], 10);
  var x2 = parseInt(z[0], 10);
  var y2 = parseInt(z[1], 10);
  var edges = 1;

  for (var i = 1; i < points.length; ++i){
	 if (points[i].length > 1){
		edges++;
		z = points[i].split(",");
	   z[0] = parseInt(z[0], 10);
	   z[1] = parseInt(z[1], 10);
		if (z[0] < x1) {
                  x1 = z[0];
                }
		if (z[1] < y1) {
                  y1 = z[1];
                }
		if (z[0] > x2) {
                  x2 = z[0];
                }
		if (z[1] > y2) {
                  y2 = z[1];
                }
	 }
  }

  var p1 = new Point(parseInt(x1, 10), parseInt(y1, 10));
  var p2 = new Point(parseInt(x2, 10), parseInt(y2, 10));
  this.getBounds().setStart(p1);
  this.getBounds().setEnd(p2);
  this.edgeNumber().setVal(edges);
  this.getFillColour().fromCSS(n.getAttribute("fill"));
  this.getFillColour().getOpacity().setVal(n.getAttribute("fill-opacity"));
  this.getBorderColour().fromCSS(n.getAttribute("stroke"));
  this.getBorderColour().getOpacity().setVal(n.getAttribute("stroke-opacity"));
  //this.draw(c);? or shall we draw all at the end?  how can i get canvas?
};


/**
 * Transform an svg node into a text
 * @param {node} n the SVG node containg the property
 */
Text.prototype.fromSVG = function (n) {
  var x1 = parseInt(n.getAttribute("x"), 10);
  var y1 = parseInt(n.getAttribute("y"), 10);
  var txt = n.childNodes[0].nodeValue;
  var h = parseInt(n.getAttribute("font-size"), 10);
  var w = parseInt(n.getAttribute("textLength"), 10);
  this.setText(new TextString(txt));
  this.setFont(new TextFont(n.getAttribute("font-family")));
  var y2 = y1 + h;
  /*if (w) {*/
	  var x2 = x1 + w;
  /*}
  else {
	 var x2 = (h/2) * txt.length;

  }*/
  //var p1 = new Point(parseInt(x1, 10), parseInt(y1, 10));
  //var p2 = new Point(x2, y2);

  
  var p1 = new Point(x1, y1);
  var p2 = new Point(x1+400, y2);

  this.getBounds().setStart(p1);
  this.getBounds().setEnd(p2);
  this.getTextColour().fromCSS(n.getAttribute("fill"));
  this.getTextColour().getOpacity().setVal(n.getAttribute("fill-opacity"));
  this.getBorderColour().fromCSS(n.getAttribute("stroke"));
  this.getBorderColour().getOpacity().setVal(n.getAttribute("stroke-opacity"));
};
