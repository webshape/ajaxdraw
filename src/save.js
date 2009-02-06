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
function SVGGenerator(w, h) {
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
  // TODO: close tag somewhere
  // maybe add flag to attr to tell if that is the last attribute
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
 * Create the SVG tag that represents the figure
 * @param {SVGGenerator} gen the SVGGenerator that contains the SVGDocument
 */
function toSVG(gen) { /*should be an implementation of a method of an interface*/
  gen.startCommand(this.name()); /* this.name() returns the name of the figure? */
  /* depending from which figure it is, it will write different attributes */
}
