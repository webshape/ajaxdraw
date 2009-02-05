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
  this._borderColour = new Colour(0, 0, 0, new Opacity(1));
  this._bounds = new BoundingRectangle(0, 0, 0, 0);
}

Figure.abstractMethod('draw');
Figure.abstractMethod('getMainPoints');
Figure.reader('_bounds', 'getBounds');
Figure.reader('_borderColour', 'getBorderColour');

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
 * Apply the property to the given context
 * @param {Context} ctx the current canvas context
 */
Property.abstractMethod('applyToContext');

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

BoundingRectangle.reader('_start', 'start');
BoundingRectangle.reader('_end', 'end');

BoundingRectangle.prototype = new Property();

BoundingRectangle.prototype.createWidget = function () {
  // TODO: implement
};

BoundingRectangle.prototype.applyToContext = function (ctx) {
  ctx.translate(this._start.x, this._start.y);
  var scaley = this._end.y - this._start.y;
  ctx.scale(this._end.x - this._start.x, scaley);
  // avoid too thick lines
  ctx.lineWidth = 1/scaley;
};

/**
 * @constructor
 * The opacity of a colour
 * @param val the opacity value
 */
function Opacity(val) {
  this.val = val;
}

Opacity.accessors('val', 'getVal', 'setVal');

Opacity.prototype.applyToContext = function (ctx) {
  ctx.globalAlpha = this.val;
};

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
  return 'rgb(' + this._r.toString() + ',' +
    this._g.toString() + ',' + this._b.toString() + ')';
};

Colour.prototype.applyToContext = function (ctx) {
  ctx.strokeStyle = this.toCSS();
  this._o.applyToContext(ctx);
};

/**
 * Inner colour of a figure
 */
function FillColour (r, g, b, o) {
  Colour.call(this, r, g, b, o);
}

FillColour.prototype = new Colour();

FillColour.prototype.applyToContext = function (ctx) {
  ctx.fillStyle = this.toCSS();
  this._o.applyToContext(ctx);
};

/**
 * Fill colour of a text
 */
var TextColour = FillColour;

/**
 * @constructor
 * Number of edges of a polygon
 * @param {Integer} val value
 */
function EdgeNumber (val) {
  this.val = val;
}

EdgeNumber.prototype = new Property();

EdgeNumber.accessors('val', 'getVal', 'setVal');

EdgeNumber.prototype.createWidget = function () {
  // TODO: implement
};

/**
 * @constructor
 * Font of a text
 * @param {String} name font name
 */
function TextFont (name) {
  this._name = name;
}

TextFont.prototype = new Property();

TextFont.prototype.toCSS = function () {
  return this._name;
};

TextFont.prototype.applyToContext = function (ctx) {
  ctx.font = this.toCSS();
};

/**
 * @constructor
 * Size of a text
 * @param {Float} sz the size
 * @param {String} unit measure unit (px, em, etc.)
 */
function TextSize (sz, unit) {
  this._sz = sz;
  this._unit = unit;
}

TextSize.prototype = new Property();

TextSize.prototype.toCSS = function () {
  return this._sz + this._unit;
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

/**
 * @constructor
 * A circle
 */
function Circle () {
  Figure.call(this);
  this._fillColour = new Colour(0, 0, 0, new Opacity(1));
}

Circle.prototype = new Figure();

Circle.prototype.draw = function (c) {
  var ctx = c.getContext('2d');
  ctx.save();
  this.getBounds().applyToContext(ctx);
  ctx.beginPath();
  // standard circle
  ctx.arc(0.5, 0.5, 0.5, 0, Math.PI * 2, false);
  this._fillColour.applyToContext(ctx);
  ctx.fill();
  this.getBorderColour().applyToContext(ctx);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};

/**
 * @constructor
 * A polygon
 */
function Polygon () {
  Figure.call(this);
  this._fillColour = new FillColour(0, 0, 0, new Opacity(1));
  this._en = new EdgeNumber(3);
}

Polygon.prototype = new Figure();

Polygon.prototype.draw = function (c) {
  var ctx = c.getContext('2d');
  ctx.save();
  this.getBounds().applyToContext(ctx);
  
  var points = []; // points of the regular polygon
  // n must be > 0
  var n = this._en.getVal();
  var step = Math.PI * 2 / n;
  var angle = 0;
  for (var i = 0; i < n; ++i) {
    // points on a circumference with radius 1 and centre in (0, 0)
    points.push(new Point(Math.cos(angle), Math.sin(angle)));
    angle += step;
  }
  ctx.beginPath();
  // draw it
  // adapt coords to points
  ctx.translate(0.5, 0.5);
  ctx.scale(1/2, 1/2);
  ctx.moveTo(points[0].x, points[0].y);
  points.each(function (pt) {
                ctx.lineTo(pt.x, pt.y);
              });
  this._fillColour.applyToContext(ctx);
  ctx.fill();
  this.getBorderColour().applyToContext(ctx);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};

/**
 * @constructor
 * A rectangle
 */
function Rectangle () {
  this._fillColour = new FillColour(0, 0, 0, new Opacity(1));
}

Rectangle.prototype = new Figure();

Rectangle.prototype.draw = function (c) {
  var ctx = c.getContext('2d');
  ctx.save();
  this.getBounds().applyToContext(ctx);
  this._fillColour.applyToContext(ctx);
  ctx.fillRect(0, 0, 1, 1);
  this.getBorderColour().applyToContext(ctx);
  ctx.strokeRect(0, 0, 1, 1);
  ctx.restore();
};
