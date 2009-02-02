/**
 * @fileoverview
 * Abstract figure and figures management
 * @author Dissegna Stefano
 */

/**
 * A 2D point
 * @constructor
 * @param {Float} x x coord
 * @param {Float} y y coord
 */
function Point(x, y) {
  this.x = x;
  this.y = y;
}

/**
 * Abstract figure
 */
function Figure() {
  // default values
  this._selected = false;
  this._borderColour = new Colour(0, 0, 0, 1);
  this._bounds = new BoundingRectangle(0, 0, 0, 0);
}

Figure.abstractMethod('draw');
Figure.abstractMethod('getMainPoints');

/**
 * Set selection status of the figure
 * @param {Boolean} val the status to set
 */
Figure.prototype.setSelection = function (val) {
  this._selected = val;
};

/**
 * Get selection status of the figure
 * @return {Boolean} the current selection status
 */
Figure.prototype.isSelected = function () {
  return this._selected;
};

/**
 * Apply fn to each property of the figure
 * @param {Function} fn one arg fuction to apply
 */
Figure.prototype.eachProperty = function (fn) {
  fn.call(this, this._borderColour);
  fn.call(this, this._bounds);
};

/**
 * Property of a figure
 */
function Property() {
  
}

Property.abstractMethod('createWidget');

/**
 * @constructor
 * Rectangle containing a figure
 * Represent both position and size
 * @param {Point} start top left corner of the rectangle
 * @param {Point} end bottom right corner of the rectangle
 */
function BoundingRectangle(start, end) {
  this._start = start;
  this._end = end;
}

BoundingRectangle.prototype = new Property();

BoundingRectangle.prototype.createWidget = function () {
  // TODO: implement
};

/**
 * @constructor
 * The opacity of a colour
 * @param val the opacity value
 */
function Opacity(val) {
  this.val = val;
}

Opacity.accessors('val');

/**
 * @constructor
 * An RGB coulour
 * @param r red component
 * @param g green component
 * @param b blue component
 * @param {Opacity} o the opacity of the colour
 */
function Colour(r, g, b, o) {
  this._r = r;
  this._g = g;
  this._b = b;
  this._o = o;
}

Colour.prototype = new Property();

Colour.prototype.createWidget = function () {
  // TODO: implement
};

Colour.prototype.toCSS = function () {
  return '#' + this._r.toString(16) + 
    this._g.toString(16) + this._b.toString(16);
};

/**
 * Inner colour of a figure
 * there is no difference with the Colour proto
 */
var FillColour = Colour;

/**
 * Colour of a text
 * there is no difference with the Colour proto
 */
var TextColour = Colour;

/**
 * @constructor
 * Number of edges of a polygon
 * @param {Integer} val value
 */
function EdgeNumber (val) {
  this.val = val;
}

EdgeNumber.prototype = new Property();

EdgeNumber.accessors('val');

EdgeNumber.prototype.createWidget = function () {
  // TODO: implement
};

/**
 * @constructor
 * A collection of figures
 */
function FigureSet () {
  this._figures = [];
}

/**
 * Apply a function to each figure
 * @param {Function} fn function to apply
 */
FigureSet.prototype.each = function (fn) {
  this._figures.each(fn);
};

/**
 * Add a new figure to the collection
 * @param {Figure} f figure to add
 */
FigureSet.prototype.add = function (f) {
  this._figures.push(f);
};

/**
 * Remove the matching figure
 * @param {Figure} f figure to remove
 */
FigureSet.prototype.rem = function (f) {
  // maybe slow
  this._figures = this._figures.grep(function (el) {
                                       return el != f;
                                     });
};

/**
 * Select the figure matching the given point
 * @param {Point} where point to match against
 * @return matching figure or null
 */
FigureSet.prototype.selectFigure = function (where) {
  // distance between 2 points
  var distance = function (pt1, pt2) {
    var dx = pt1.x - pt2.x;
    var dy = p1.y - pt2.y;
    // best will maximize, so we need to invert the score
    return -Math.sqrt(dx*dx + dy*dy); 
  };
  // maximum distance we're willing to accept
  var max_distance = 5;
  // best value for each figure
  var best_each = this._figures.map(function (f) {
                                      return f.getMainPoints().best(distance);
                                    });
  var best_match = best_each.best(function (x) {
                                    return x[1]; // the value
                                  });
  // best_match is [[Figure, score], score]
  var f = best_match[0][0];
  var dist = -best_match[1];
  if (f === null || dist > max_distance) {
    return null;
  }
  
  return f;
};