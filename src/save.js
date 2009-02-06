/**
 *	@fileoverview
 * Save the content of the canvas in SVG format
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
  var doc = new SVGGenerator;
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
function SVGGenerator(w, h) { /*TODO change > into &gt etc.. */
  this._doc = "<?xml version=\"1.0\" standalone=\"no\"?>\n\
					<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n\
					<svg width=\"" + w + "\" height=\"" + h + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n";
}

/**
 * Write the beginning of a tag
 * @param {String} name the name of the tag
 */
SVGGenerator.prototype.startCommand = function (name) {
  this._doc += "<" + name + " ";
};

/**
 * Write the attributes of a tag in the form name="value"
 * @param {String} name the name of the attribute
 * @param {String} value the value of the attribute
 * @param {Boolean} last if it is the last attribute
 */
SVGGenerator.prototype.attr = function (name, value, last) {
  this._doc += name + "=\"" + value + "\"";
  if (last)
	 this._doc += ">";
};

/**
 * Write the text between the tags
 * @param {String} t the text
 */
SVGenerator.protype.text = function (t) {
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
  this._doc = "</svg>";
  return this._doc;
};



/**
 * Transform the circle figure into SVG tags
 * @param {SVGGenerator} gen to call the methods to create tags
 */
Circle.prototype.toSVG = function(gen) {
  gen.startCommand("circle");
  var cx = this.getBounds().start().x + this.getBounds().center().x;
  gen.attr("cx", cx, false);
  var cy = this.getBounds().start().y + this.getBounds().center().y;
  gen.attr("cy", cy, false);
  gen.attr("r", this.getBounds().w()/2, false);
  gen.attr("fill", this.getFillColour().toCSS(), false);
  gen.attr("stroke", this.getBorderColour().toCSS(), false);
  /* the size of the stroke is not implemented; am i wrong?*/
};



/**
 * Transform the rectangle figure into SVG tags
 * @param {SVGGenerator} gen to call the methods to create tags
 */
Rectangle.prototype.toSVG = function(gen) {
  gen.startCommand("rect");
  this.getBounds()
  gen.attr("x", this.getBounds().start().x, false);
  gen.attr("y", this.getBounds().start().y, false);
  gen.attr("rx", 0, 0, false);
  gen.attr("ry", 0, 0, false);
  gen.attr("width", this.getBounds().w(), false);
  gen.attr("height", this.getBounds().h(), false);
  gen.attr("fill", this.getBounds().getFillColour(), false);
};