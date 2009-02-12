/**
 *	@fileoverview
 * Save the content of the canvas in SVG format
 * @author Marco Cunico
 * @author Mirco Geremia
 */


/**
 * SVGWriter
 */
function SVGWriter() {}

/**
 * Call toSVG() on each figure end return the SVG document
 * @param {FigureSet} fs contains all the figures
 */
SVGWriter.prototype.write = function (fs) {
  var doc = new SVGGenerator(1000, 1000);
  fs.each(function (figure) {
	    figure.toSVG(doc);
          });
  return doc.flush();
};


/**
 * @constructor
 * SVGGenerator contains the document
 * @param {Integer} w width of the canvas element
 * @param {Integer} h height of the canvas element
 */
function SVGGenerator(w, h) {
  this._doc = "<?xml version=\"1.0\" standalone=\"no\"?>\n\
<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n\
<svg width=\"" + w + "\" height=\"" + h + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n";
}

/**
 * Write the beginning of a tag
 * @param {String} name the name of the tag
 */
SVGGenerator.prototype.startCommand = function (name) {
  this._doc += "<" + name;
};

/**
 * Write the attributes of a tag in the form name="value"
 * @param {String} name the name of the attribute
 * @param {String} value the value of the attribute
 * @param {Boolean} last if it is the last attribute
 */
SVGGenerator.prototype.attr = function (name, value, last) {
  this._doc += " " + name + "=\"" + value + "\"";
  if (last){
	 this._doc += ">";
  }
};

/**
 * Write the text between the tags
 * @param {String} t the text
 */
SVGGenerator.prototype.text = function (t) {
  this._doc += "\n" + t + "\n";
}

/**
 * Write the end of a tag
 * @param {String} name the name of the tag
 */
SVGGenerator.prototype.endCommand = function (name) {
  this._doc += "</" + name + ">\n";
};

/**
 * Return the SVG document as a string
 */
SVGGenerator.prototype.flush = function () {
  this._doc += "</svg>";
  return this._doc;
};


/**
 * Transform the rectangle figure into SVG tags
 * @param {SVGGenerator} gen to call the methods to create tags
 */
Rectangle.prototype.toSVG = function(gen) {
  gen.startCommand("rect");
  var width = this.getBounds().w();
  var height = this.getBounds().h();
  var reverse = false;
  var scalex = 1;
  var scaley = 1;
  var x = this.getBounds().start().x;
  var y = this.getBounds().start().y;
  if (width < 0) {
	 width *= -1;
	 scalex = -1;
	 reverse = true;
	 x *= -1;
  }
  if (height < 0) {
	 height *= -1;
	 scaley = -1;
	 reverse = true;
	 y *= -1;
  }
  gen.attr("x", x, false);
  gen.attr("y", y, false);
  if (reverse)
    gen.attr("transform", "scale(" + scalex +","+ scaley + ")", false);
  gen.attr("width", width, false);
  gen.attr("height", height, false);
  gen.attr("fill", this.getFillColour().toCSS(), false);
  gen.attr("stroke", this.getBorderColour().toCSS(), true);
  gen.endCommand("rect");
};


/**
 * Transform the line figure into SVG tags
 * @param {SVGGenerator} gen to call the methods to create tags
 */
StraightLine.prototype.toSVG = function(gen) {
  gen.startCommand("line");
  gen.attr("x1", this.getBounds().start().x, false);
  gen.attr("y1", this.getBounds().start().y, false);
  gen.attr("x2", this.getBounds().end().x, false);
  gen.attr("y2", this.getBounds().end().y, false);
  gen.attr("stroke", this.getBorderColour().toCSS(), true);
  gen.endCommand("line");
};

/**
 * Transform free-hand lines into SVG tags
 * @param {SVGGenerator} gen to call the methods to create tags
 */
FreeLine.prototype.toSVG = function(gen) {
  gen.startCommand("path");
  gen.attr("stroke", this.getBorderColour().toCSS(), false);
  gen.attr("fill", "none", false);
  var p = this.getPoints();
  var c = "M " + p[0].x + "," + p[0].y;
  var i = 0;
  for (i = 0; i+2 < p.length; i += 3) {
	 c += " C";
	 for (var j = i; j < i+3; j++) {
		c += " " + p[j].x + "," + p[j].y;
	 }
  }
  var r = p.length - i;
  if (r == 2) {
    // quadratic curve
    c += " Q " + p[i].x + "," + p[i].y + " " + p[i+1].x + "," + p[i+1].y;
  } else {
    if (r == 1) {
      // straight line
      c += " L " + p[i].x + "," + p[i].y;
    }
  }
  gen.attr("d", c, true);
  gen.endCommand("path");
};


/**
 * Transform bezier curve into SVG tags
 * @param {SVGGenerator} gen to call the methods to create tags
 */
BezierCurve.prototype.toSVG = function(gen) {
//  FreeLine.call(this, this, gen);
};


/**
 * Transform the polygon figure into SVG tags
 * @param {SVGGenerator} gen to call the methods to create tags
 */
Polygon.prototype.toSVG = function(gen) {
  gen.startCommand("polygon");
  gen.attr("fill", this.getFillColour().toCSS(), false);
  gen.attr("stroke", this.getBorderColour().toCSS(), false);
  var aPoints = this.getPoints();
  var points = "";
  for (var i = 0; i < aPoints.length; ++i)
	 points += (aPoints[i].x + this.getBounds().start().x) + "," + (aPoints[i].y + this.getBounds().start().y) + " ";
  gen.attr("points", points, true);
  gen.endCommand("polygon");
};


/**
 * Transform the ellipse figure into SVG tags (a circle is a particular ellipse)
 * @param {SVGGenerator} gen to call the methods to create tags
 */
Circle.prototype.toSVG = function(gen) {
  gen.startCommand("ellipse");
  var cx = this.getBounds().start().x + this.getBounds().centre().x;
  gen.attr("cx", cx, false);
  var cy = this.getBounds().start().y + this.getBounds().centre().y;
  gen.attr("cy", cy, false);
  gen.attr("rx", this.getBounds().w()/2, false);
  gen.attr("ry", this.getBounds().h()/2, false);
  gen.attr("fill", this.getFillColour().toCSS(), false);
  gen.attr("stroke", this.getBorderColour().toCSS(), true);
  gen.endCommand("ellipse");
};


/**
 * Transform the text into SVG tags (a circle is a particular ellipse)
 * @param {SVGGenerator} gen to call the methods to create tags
 */
/*
Text.prototype.toSVG = function(gen) {
  gen.startCommand("text");
  gen.attr("x", this.getBounds().start().x, false);
  gen.attr("y", this.getBounds().end().y, false);
  gen.attr("font-family", this.getFont(), false);
  gen.attr("font-size", Math.abs(this.getBounds().h()), false);
  gen.attr("fill", this.getTextColour().toCSS(), false);
  gen.attr("stroke", this.getBorderColour().toCSS(), true);
  gen.text(this.getText());
  gen.endCommand("text");
};*/