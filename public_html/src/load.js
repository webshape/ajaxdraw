/**
 * Copyright (C) 2009 WebShape
 * Use, modification and distribution is subject to the GPL license
 *
 * @fileoverview
 * Transform an SVG document in a FigureSet istance
 * @author Marco Cunico
 * @author Mirco Geremia
 */

var nf = 0; /* the number of the current parseing figure*/

/**
 * SVGReader create a figureSet and an elementRegistry
 * @constructor
 */
function SVGReader() {}

/**
 * Error manager
 * @param {String} msg the description of the error
 */
function ParsingError () {}

ParsingError.prototype.err = function (msg) {
  alert(msg);
};

ParsingError.prototype.hexCheck = function (str, fs){
  if (!str.match(/^#([0-9]|a|A|b|B|c|C|d|D|e|E|f|F){6}$/) && str != "none"){
	 this.err("Figura n. " + nf + "\nIl valore di " +  fs + " non e' un valore esadecimale valido");
	 return false;
  }
  return true;
};

ParsingError.prototype.opCheck = function (op, fs){
  if (isNaN(op)){
	 this.err("Figura n. " + nf + "\n" + fs + "-opacity deve avere un valore numerico");
	 return false;
  }
  if (op < 0 || op > 1){
	 this.err("Figura n. " + nf + "\nIl valore di " + fs + "-opacity deve essere compreso tra 0 e 1");
	 return false;
  }
  return true;
};

ParsingError.prototype.intCheck = function (n, name){
  if (n !== null){
	 if (isNaN(n)){
		this.err("Figura n. " + nf + "\n" + name + " deve avere un valore numerico");
		return false;
	 }

	 if ((name == "height" || name == "width" || name == "font-size" || name == "rx" || name == "ry") && n < 0){
		// h, w and font-size can't be negative
        if (nf === 0) {
			 this.err("Errore elemento SVG \n" + name + " non puo' avere un valore negativo");
			 }
        else {
			 this.err("Figura n. " + nf + "\n" + name + " non puo' avere un valore negativo");
			 }
		  return false;
	 }
  }
  else { // the attribute missed
	 this.err("Figura n. " + nf + "\nL'attributo " + name + " non e' definito");
	 return false;
  }
  return true;
};

// global variable to call error methods
var perr = new ParsingError();


/**
 * Create an instance of FigureSet parsing an SVG document
 * @param {String} doc the name of the file SVG
 */
// global variable used to know which figures is currently parsing
SVGReader.prototype.read = function (doc) {
  var fs = new FigureSet();
  var psr = new XMLParser();
  var xmlDoc = psr.parsing(doc);

  var x = xmlDoc.getElementsByTagName("svg");

  var w = x[0].getAttribute("width");
  var h = x[0].getAttribute("height");
  if (!(perr.intCheck(h, "height")) || !(perr.intCheck(w, "width"))){
    return 0;
  }

  if (x[0].childNodes[1].nodeName == "g"){ // inkscape plan svg
	 x = xmlDoc.getElementsByTagName("g");
  }
  for (var i = 0; i < x[0].childNodes.length; i++) {
    var n = x[0].childNodes[i];
    if (n.nodeName != "#text") {
		nf++;
      var f = registry.makeFigureClassFromTag(n.nodeName); // returns an instance of a figure
      // ignore unknow tags
      if (f !== null) {
		  if (f.fromSVG(n)){
			 fs.add(f);
		  }
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
  var errstr = null;
  try { //Internet Explorer
	 xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	 xmlDoc.async = false;
    // xmlDoc.load(doc);
	 xmlDoc.loadXML(doc);

	 if (xmlDoc.parseError.errorCode !== 0) {
		errstr = ("Error in line " + xmlDoc.parseError.line +
				" position " + xmlDoc.parseError.linePos +
				"\nError Code: " + xmlDoc.parseError.errorCode +
				"\nError Reason: " + xmlDoc.parseError.reason +
				"Error Line: " + xmlDoc.parseError.srcText);
    }
  }
  catch(e) {
	 try { //Firefox
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(doc, "text/xml");
		if (xmlDoc.documentElement.nodeName == "parsererror") {
		  errstr = xmlDoc.documentElement.childNodes[0].nodeValue;
                }
    }
    catch(e2) {errstr = e2.message;}
  }

  if (errstr !== null) {
    throw errstr;
  } else {
    return xmlDoc;
  }
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
	 if (tag == 'text'){
		return new fn(new TextString("canvas"));
	 }
	 else {
		return new fn();
	 }
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
  var x1 = parseInt(n.getAttribute("x"), 10);
  var y1 = parseInt(n.getAttribute("y"), 10);
  var w = parseInt(n.getAttribute("width"), 10);
  var h = parseInt(n.getAttribute("height"), 10);
  if (!(perr.intCheck(x1, "x") && perr.intCheck(y1, "y") && perr.intCheck(h, "height") && perr.intCheck(w, "width"))){
	 return 0;
  }
  var x2 = x1 + w;
  var y2 = y1 + h;
  var p1 = new Point(x1, y1);
  var p2 = new Point(x2, y2);
  this.getBounds().setStart(p1);
  this.getBounds().setEnd(p2);

  // optional attributes
  var fc = n.getAttribute("fill");
  var fo = parseFloat(n.getAttribute("fill-opacity"));
  var sc = n.getAttribute("stroke");
  var so = parseFloat(n.getAttribute("stroke-opacity"));

  if (fc && perr.hexCheck(fc, "fill")){
	 this.getFillColour().fromCSS(fc);
  }
  if (sc && perr.hexCheck(sc, "stroke")){
	 this.getBorderColour().fromCSS(sc);
  }
  if (fo && perr.opCheck(fo, "fill")){
	 this.getFillColour().getOpacity().setVal(fo);
  }
  if (so && perr.opCheck(so, "stroke")){
	 this.getBorderColour().getOpacity().setVal(so);
  }
  return 1; // everything's fine
};


/**
 * Transform an svg node into an ellipse
 * @param {node} n the SVG node containg the properties
 */
Circle.prototype.fromSVG = function (n) {
  var cx = parseInt(n.getAttribute("cx"), 10);
  var cy = parseInt(n.getAttribute("cy"), 10);
  var rx = parseInt(n.getAttribute("rx"), 10);
  var ry = parseInt(n.getAttribute("ry"), 10);
  if (!(perr.intCheck(cx, "cx") && perr.intCheck(cy, "cy") && perr.intCheck(rx, "rx") && perr.intCheck(ry, "ry"))){
	 return 0;
  }
  var p1 = new Point((cx - rx), (cy - ry));
  var p2 = new Point((cx + rx), (cy + ry));
  this.getBounds().setStart(p1);
  this.getBounds().setEnd(p2);

  // optional attributes
  var fc = n.getAttribute("fill");
  var fo = parseFloat(n.getAttribute("fill-opacity"));
  var sc = n.getAttribute("stroke");
  var so = parseFloat(n.getAttribute("stroke-opacity"));

  if (fc && perr.hexCheck(fc, "fill")){
	 this.getFillColour().fromCSS(fc);
  }
  if (sc && perr.hexCheck(sc, "stroke")){
	 this.getBorderColour().fromCSS(sc);
  }
  if (fo && perr.opCheck(fo, "fill")){
	 this.getFillColour().getOpacity().setVal(fo);
  }
  if (so && perr.opCheck(so, "stroke")){
	 this.getBorderColour().getOpacity().setVal(so);
  }
  return 1; // everything's fine
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
  if (!(perr.intCheck(x1, "x1") && perr.intCheck(y1, "y1") && perr.intCheck(x2, "x2") && perr.intCheck(y2, "y2"))){
	 return 0;
  }
  var p1 = new Point(x1, y1);
  var p2 = new Point(x2, y2);
  this.getBounds().setStart(p1);
  this.getBounds().setEnd(p2);

  // optional attributes
  var sc = n.getAttribute("stroke");
  var so = parseFloat(n.getAttribute("stroke-opacity"));

  if (sc && perr.hexCheck(sc, "stroke")){
	 this.getBorderColour().fromCSS(sc);
  }
  if (so && perr.opCheck(so, "stroke")){
	 this.getBorderColour().getOpacity().setVal(so);
  }
  return 1; // everything's fine
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

  // optional attributes
  var sc = n.getAttribute("stroke");
  var so = parseFloat(n.getAttribute("stroke-opacity"));

  if (sc && perr.hexCheck(sc, "stroke")){
	 this.getBorderColour().fromCSS(sc);
  }
  if (so && perr.opCheck(so, "stroke")){
	 this.getBorderColour().getOpacity().setVal(so);
  }
  return 1; // everything's fine
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

  // optional attributes
  var fc = n.getAttribute("fill");
  var fo = parseFloat(n.getAttribute("fill-opacity"));
  var sc = n.getAttribute("stroke");
  var so = parseFloat(n.getAttribute("stroke-opacity"));

  if (fc && perr.hexCheck(fc, "fill")){
	 this.getFillColour().fromCSS(fc);
  }
  if (sc && perr.hexCheck(sc, "stroke")){
	 this.getBorderColour().fromCSS(sc);
  }
  if (fo && perr.opCheck(fo, "fill")){
	 this.getFillColour().getOpacity().setVal(fo);
  }
  if (so && perr.opCheck(so, "stroke")){
	 this.getBorderColour().getOpacity().setVal(so);
  }
  return 1; // everything's fine
};


/**
 * Transform an svg node into a text
 * @param {node} n the SVG node containg the property
 */
Text.prototype.fromSVG = function (n) {
  //get all the attributes
  var x1 = parseInt(n.getAttribute("x"), 10);
  var y1 = parseInt(n.getAttribute("y"), 10);
  var txt = n.childNodes[0].nodeValue;
  var h = parseInt(n.getAttribute("font-size"), 10);
  if (!(perr.intCheck(x1, "x") && perr.intCheck(y1, "y") && perr.intCheck(h, "font-size"))){
	 // something goes wrong
	 return 0;
  }
  var ff = n.getAttribute("font-family");
  if (!ff){
	 perr.err("L'attributo font-family non e' definito");
	 return 0;
  }
  // following are optional attributes
  var w = parseInt(n.getAttribute("textLength"), 10);
  var fc = n.getAttribute("fill");
  var fo = parseFloat(n.getAttribute("fill-opacity"));
  var sc = n.getAttribute("stroke");
  var so = parseFloat(n.getAttribute("stroke-opacity"));

  this.setText(new TextString(txt));
  this.setFont(new TextFont(ff));
  var y2 = y1 + h;
  var x2 = (h/2) * txt.length;
  if (w && !isNaN(w)) {
	  x2 = x1 + w;
  }
  var p1 = new Point(x1, y1);
  var p2 = new Point(x2, y2);

  this.getBounds().setStart(p1);
  this.getBounds().setEnd(p2);
  if (fc && perr.hexCheck(fc, "fill")){
	 this.getTextColour().fromCSS(fc);
  }
  if (sc && perr.hexCheck(sc, "stroke")){
	 this.getBorderColour().fromCSS(sc);
  }
  if (fo && perr.opCheck(fo, "fill")){
	 this.getTextColour().getOpacity().setVal(fo);
  }
  if (so && perr.opCheck(so, "stroke")){
	 this.getBorderColour().getOpacity().setVal(so);
  }
  return 1; // everything's fine
};
