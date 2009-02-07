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
  this._bounds = new BoundingRectangle(new Point(0, 0), new Point(0, 0));
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

BoundingRectangle.prototype = new Property();

BoundingRectangle.accessors('_start', 'start', 'setStart');
BoundingRectangle.accessors('_end', 'end', 'setEnd');

/**
 * Get the height of the rectangle
 * @return {Float} the height
 */
BoundingRectangle.prototype.h = function () {
  return this._end.y - this._start.y;
};

/**
 * Get the width of the rectangle
 * @return {Float} the width
 */
BoundingRectangle.prototype.w = function () {
  return this._end.x - this._start.x;
};

/**
 * Get the centre of the rectangle
 * @return {Point} the central point, considering the top left corner as the origin
 */
BoundingRectangle.prototype.centre = function () {
  return new Point((this._end.x - this._start.x)/2, 
                   (this._end.y - this._start.y)/2);
};


BoundingRectangle.prototype.createWidget = function () {
  // TODO: implement
};

/**
 * Translate coords origin to the top left corner of the rectangle
 * @param {Context2D} ctx the drawing context
 */
BoundingRectangle.prototype.applyToContext = function (ctx) {
  ctx.translate(this._start.x, this._start.y);
  //var scaley = this._end.y - this._start.y;
  //ctx.scale(this._end.x - this._start.x, scaley);
  // avoid too thick lines
  //ctx.lineWidth = 1/scaley;
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

/**
 * Set the global alpha value
 * @param {Context2D} ctx the drawing context 
 */
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
  this.set(r, g, b, o);
}

Colour.prototype = new Property();

Colour.prototype.set = function (r, g, b, o) {
  this._r = r;
  this._g = g;
  this._b = b;
  this._o = o;  
};

Colour.prototype.createWidget = function () {
  // TODO: implement
};

Colour.prototype.toCSS = function () {
  return 'rgb(' + this._r.toString() + ',' +
    this._g.toString() + ',' + this._b.toString() + ')';
};

/**
 * Set the current stroke colour
 * @param {Context2D} ctx the drawing context
 */
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

/**
 * Set the current fill colour
 * @param {Context2D} ctx the drawing context
 */
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
  var bounds = this.getBounds();
  bounds.applyToContext(ctx);
  ctx.beginPath();

  var KAPPA = 4 * ((Math.sqrt(2) -1) / 3);

  var rx = bounds.w()/2;
  var ry = bounds.h()/2;

  var centre = bounds.centre();
  var cx = centre.x;
  var cy = centre.y;
  
  ctx.moveTo(cx, cy - ry);
  ctx.bezierCurveTo(cx + (KAPPA * rx), cy - ry,  cx + rx,
                    cy - (KAPPA * ry), cx + rx, cy);
  ctx.bezierCurveTo(cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), 
                    cy + ry, cx, cy + ry);
  ctx.bezierCurveTo(cx - (KAPPA * rx), cy + ry, cx - rx, 
                    cy + (KAPPA * ry), cx - rx, cy);
  ctx.bezierCurveTo(cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), 
                    cy - ry, cx, cy - ry);

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

Polygon.reader('_en', 'edgeNumber');

/**
 * Get an array of vertexes of the polygon
 * the origin is the top-left corner of the BoundingRectangle
 */
Polygon.prototype.getPoints = function () {
  var bounds = this.getBounds();
  var halfw = Math.abs(bounds.w()/2);
  var halfh = Math.abs(bounds.h()/2);
  var centre = bounds.centre();
  
  var points = []; // points of the regular polygon
  // n must be > 0
  var n = this._en.getVal();
  var step = Math.PI * 2 / n;
  var angle = 0;
  for (var i = 0; i < n; ++i) {
    // points on a circumference with radius 1 and centre in (0, 0)
    // adapted to real height and width
    // adapted to the position
    points.push(new Point(centre.x + halfw*Math.cos(angle), 
                          centre.y + halfh*Math.sin(angle)));
    angle += step;
  }

  return points;
};

Polygon.prototype.draw = function (c) {
  var ctx = c.getContext('2d');
  ctx.save();
  var bounds = this.getBounds();
  bounds.applyToContext(ctx);
  var points = this.getPoints();
  
  ctx.beginPath();
  // draw it
  // adapt coords to points
  var centre = bounds.centre();
  ctx.moveTo(points[0].x, points[0].y);
  points.each(function (pt) {
                ctx.lineTo(pt.x, pt.y);
              });
  // close the polygon
  ctx.lineTo(points[0].x, points[0].y);
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
  Figure.call(this);
  this._fillColour = new FillColour(0, 0, 0, new Opacity(1));
}

Rectangle.prototype = new Figure();

Rectangle.prototype.draw = function (c) {
  var ctx = c.getContext('2d');
  ctx.save();
  var b = this.getBounds();
  b.applyToContext(ctx);
  this._fillColour.applyToContext(ctx);
  ctx.fillRect(0, 0, b.w(), b.h());
  this.getBorderColour().applyToContext(ctx);
  ctx.strokeRect(0, 0, b.w(), b.h());
  ctx.restore();
};

/**
 * @constructor
 * A straight line
 */
function StraightLine () {
  Figure.call(this);
}

StraightLine.prototype = new Figure();

StraightLine.prototype.draw = function (c) {
  var ctx = c.getContext('2d');
  ctx.save();
  var b = this.getBounds();
  var start = b.start();
  var end = b.end();
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  this.getBorderColour().applyToContext(ctx);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};

/**
 * @constructor
 * A free hand line
 */
function FreeLine () {
  Figure.call(this);
  this._pts = []; // Points composing the line
}

FreeLine.prototype = new Figure();

/**
 * Add a new point at the end of the line
 * @param {Point} pt the point to add
 */
FreeLine.prototype.extend = function (pt) {
  this._pts.push(pt);
};

/**
 * Get a list of the points composing the line converted to absolute position
 */
FreeLine.prototype.getPoints = function () {
  var bounds = this.getBounds();
  var tx = bounds.start().x;
  var ty = bounds.start().y;
  var w = bounds.w();
  var h = bounds.h();
  return this._pts.map(function (pt) {
                         return new Point(pt.x*w+tx, pt.y*h+ty);
                       });
};

FreeLine.prototype.draw = function (c) {
  var ctx = c.getContext('2d');
  ctx.save();
  var pts = this.getPoints();
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  var i = 0;
  for (i = 0; i + 3 < pts.length; i += 3) {
    ctx.bezierCurveTo(pts[i].x, pts[i].y, pts[i+1].x, pts[i+1].y,
                      pts[i+2].x, pts[i+2].y);
  }
  var remaining = (pts.length-1) - i;
  if (remaining == 2) {
    // quadratic curve
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, pts[i+1].x, pts[i+1].y);
  } else {
    if (remaining == 1) {
      // straight line
      ctx.lineTo(pts[i].x, pts[i].y);
    }
  } // else remaining == 0, nothing to do
  ctx.endPath();
  this.getBorderColour().applyToContext(ctx);
  ctx.stroke();
  ctx.restore();
};
