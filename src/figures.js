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
 * Draw small squares around the main points of the figure
 * @param {Canvas} c the canvas
 */
Figure.prototype.drawSelection = function (c) {
  if (!this.isSelected()) {
    // nothing to do
    return;
  }

  var ctx = c.getContext('2d');
  var size = 10; // 10x10 pixel squares
  var half = size/2;
  var color = new Colour(0, 0, 255, new Opacity(0.8)); // blue
  ctx.save();
  this.getMainPoints().each(function (pt) {
                              color.applyToContext(ctx);
                              ctx.strokeRect(pt.x - half, pt.y - half,
                                             size, size);
                            });
  // draw the bounds
  (new Colour(100, 100, 100, new Opacity(0.8))).applyToContext(ctx); // gray
  var b = this.getBounds();
  var x0 = b.start().x < b.end().x ? b.start().x : b.end().x;
  var y0 = b.start().y < b.end().y ? b.start().y : b.end().y;
  ctx.strokeRect(x0, y0, Math.abs(b.w()), Math.abs(b.h()));
  ctx.restore();
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
  this._val = val;
}

Opacity.accessors('_val', 'getVal', 'setVal');

/**
 * Set the global alpha value
 * @param {Context2D} ctx the drawing context
 */
Opacity.prototype.applyToContext = function (ctx) {
  ctx.globalAlpha = this._val;
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

Colour.reader('_o', 'getOpacity');

Colour.prototype.set = function (r, g, b, o) {
  this._r = r;
  this._g = g;
  this._b = b;
  this._o = o;
};

/**
 * Set the RGB components of the colour from a CSS representation
 * 
 * @param {String} repr the CSS representation
 */
Colour.prototype.fromCSS = function (repr) {
  if (!repr.match(/^#([0-9]|a|A|b|B|c|C|d|D|e|E|f|F){6}$/)) {
    throw 'Illegal CSS representation of a colour';
  }
  var res = [1, 3, 5].map(function (i) {
                            return parseInt(repr.substr(i, 2), 16);
                          });
  this._r = res[0];
  this._g = res[1];
  this._b = res[2];
};

Colour.prototype.createWidget = function () {
  // TODO: implement
};

Colour.prototype.toCSS = function () {
  var to16 = function (x) {
    if (x < 16) {
      return '0' + x.toString(16);
    } else {
      return x.toString(16);
    }
  };

  return '#' + to16(this._r) + to16(this._g) + to16(this._b);
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
function TextColour (r, g, b, o) {
  FillColour.call(this, r, g, b, o);
}
  
TextColour.prototype = new FillColour();

/**
 * @constructor
 * Number of edges of a polygon
 * @param {Integer} val value
 */
function EdgeNumber (val) {
  this._val = val;
}

EdgeNumber.prototype = new Property();

EdgeNumber.accessors('_val', 'getVal', 'setVal');

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
 * ?? Should size depend only on the BoundingRectangle?
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
  // check if we have getImageData
  var hasImageData = false;
  var c = document.createElement('canvas');
  if (c && c.getContext) {
    c = c.getContext('2d');
    if (c) {
      if (c.getImageData) {
        hasImageData = true;
      }
    }
  }
  if (!hasImageData) {
    this.selectFigure = FigureSet.prototype.fallbackSelection;
  }
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
 * Select the figure matching the given point. Fallback function
 * for browsers without getImageData. Less precise.
 * @param {Point} where point to match against
 * @return matching figure or null
 */
FigureSet.prototype.fallbackSelection = function (where) {
  for (var i = this._figures.length - 1; i >= 0; --i) {
    var f = this._figures[i];
    var b = this._figures[i].getBounds();
    var s = b.start();
    var e = b.end();
    var minx = s.x; var maxx = e.x;
    var miny = s.y; var maxy = e.y;
    if (maxx < minx) {
      maxx = minx;
      minx = e.x;
    }
    if (maxy < miny) {
      maxy = miny;
      miny = e.x;
    }
    if (minx <= where.x && where.x <= maxx &&
        miny <= where.y && where.y <= maxy) {
      if (f instanceof StraightLine) {
        // default algorithm works really bad with straight lines
        if (minx == where.x || maxx == where.x ||
            ((miny-where.y)/(minx-where.x) == (maxy-where.y)/(maxx-where.x))) {
          return this._figures[i];
        }
      } else {
        return this._figures[i];
      }
    }
  }
  return null;

/*
  var selected = null;
  var c = document.createElement('canvas');
  c.height = c.width = 1000;
  this._figures.each(function (f) {
                       c.width = 1000; // clear
                       var ctx = c.getContext('2d');
                       f.draw(c);
                       if (ctx.isPointInPath(where.x, where.y)) {
                         selected = f;
                       }
                     });
  return selected;*/
};

/**
 * Select the figure matching the given point
 * @param {Point} where point to match against
 * @return matching figure or null
 */
FigureSet.prototype.selectFigure = function (where) {
  var r = 0;
  var g = 0;
  var b = 0;
  var o = new Opacity(1);
  var next = function () {
    if (r < 255) {
      r++;
    } else if (g < 255) {
      r = 0;
      g++;
    } else if (b < 255) {
      r = g = 0;
      b++;
    } else {
      r = g = b = 0;
    }
    return [new Colour(r, g, b, o), new FillColour(r, g, b, o)];
  };

  var fs = {};
  var c = document.createElement('canvas');
  c.width = 760;
  c.height = 480;
  c.getContext('2d').lineWidth = 10; // easier selection of lines
  this.each(function (f) {
              var col = next();
              fs[col[0].toCSS()] = f;
              // momentarily change the colour
              // !! straight access to private attributes
              var old1 = f._borderColour;
              var old2 = f._fillColour;
              f._borderColour = col[0];
              // figure may not have a fillColour
              // this won't create any error
              f._fillColour = col[1];
              f.draw(c);
              f._borderColour = old1;
              f._fillColour = old2;
            });
  // get the selected pixel
  var selection = c.getContext('2d').getImageData(where.x, where.y, 1, 1).data;
  var col = new Colour(selection[0], selection[1], selection[2], o);
  //alert(col.toCSS());
  return fs[col.toCSS()] || null;
};

/**
 * @constructor
 * A circle
 */
function Circle () {
  Figure.call(this);
  this._fillColour = new FillColour(0, 0, 0, new Opacity(1));
}

Circle.prototype = new Figure();

Circle.reader('_fillColour', 'getFillColour');

Circle.prototype.eachProperty = function (fn) {
  Figure.prototype.eachProperty.call(this, fn);
  fn.call(this, this._fillColour);
};

Circle.prototype.getMainPoints = function () {
  var b = this.getBounds();
  var s = b.start();
  var e = b.end();
  var c = b.centre();
  c = new Point(c.x + s.x, c.y + s.y);
  return [new Point(s.x, c.y), new Point(c.x, s.y),
          new Point(c.x, e.y), new Point(e.x, c.y)];
};

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

Polygon.reader('_fillColour', 'getFillColour');
Polygon.reader('_en', 'edgeNumber');

Polygon.prototype.eachProperty = function (fn) {
  Figure.prototype.eachProperty.call(this, fn);
  fn.call(this, this._fillColour);
  fn.call(this, this._en);
};

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

Polygon.prototype.getMainPoints = function () {
  var s = this.getBounds().start();
  var pts = this.getPoints();
  pts.each(function (pt) {
             pt.x += s.x;
             pt.y += s.y;
           });
  return pts;
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

Rectangle.reader('_fillColour', 'getFillColour');

Rectangle.prototype.eachProperty = function (fn) {
  Figure.prototype.eachProperty.call(this, fn);
  fn.call(this, this._fillColour);
};

Rectangle.prototype.getMainPoints = function () {
  var b = this.getBounds();
  var x1 = b.start().x;
  var y1 = b.start().y;
  var x2 = b.end().x;
  var y2 = b.end().y;
  return [new Point(x1, y1), new Point(x1, y2),
          new Point(x2, y2), new Point(x2, y1)];
};

Rectangle.prototype.draw = function (c) {
  var ctx = c.getContext('2d');
  ctx.save();
  var b = this.getBounds();
  var x1 = b.start().x;
  var y1 = b.start().y;
  var x2 = b.end().x;
  var y2 = b.end().y;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1, y2);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x2, y1);
  ctx.lineTo(x1, y1);
  this.getFillColour().applyToContext(ctx);
  ctx.fill();
  this.getBorderColour().applyToContext(ctx);
  ctx.stroke();
  ctx.closePath();
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

StraightLine.prototype.getMainPoints = function () {
  var b = this.getBounds();
  return [new Point(b.start().x, b.start().y),
          new Point(b.end().x, b.end().y)];
};

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
//  alert(this.getBorderColour().toCSS());
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
 * @param {Point} pt the point to add. Coords of pt are absolute
 */
FreeLine.prototype.extend = function (pt) {
  var b = this.getBounds();
  var s = b.start();
  var newStart = new Point(s.x, s.y);
  var e = b.end();
  var newEnd = new Point(e.x, e.y);

  if (this._pts.length === 0) {
    // first point
    b.setStart(new Point(pt.x, pt.y));
    b.setEnd(new Point(pt.x, pt.y));
    this._pts.push(new Point(0, 0));
    return;
  }

  // if needed make the BoundingRectangle grow
  if (s.x <= e.x) {
    if (pt.x < s.x) {
      newStart.x = pt.x;
    }
    if (pt.x > e.x) {
      newEnd.x = pt.x;
    }
  } else {
    if (pt.x > s.x) {
      newStart.x = pt.x;
    }
    if (pt.x < e.x) {
      newEnd.x = pt.x;
    }
  }
  if (s.y <= e.y) {
    if (pt.y < s.y) {
      newStart.y = pt.y;
    }
    if (pt.y > e.y) {
      newEnd.y = pt.y;
    }
  } else {
    if (pt.y > s.y) {
      newStart.y = pt.y;
    }
    if (pt.y < e.y) {
      newEnd.y = pt.y;
    }
  }

  var w = null;
  var h = null;
  if (s.x != newStart.x || s.y != newStart.y ||
      e.x != newEnd.x || e.y != newEnd.y) {
    // bounding rectangle changed
    w = b.w();
    h = b.h();
    //s.x = newStart.x; s.y = newStart.y;
    //e.x = newEnd.x; e.y = newEnd.y;
    // get all abs values
    var p = null;
    for (var i = 0; i < this._pts.length; i++) {
      p = this._pts[i];
      p.x = p.x*w + s.x;
      p.y = p.y*h + s.y;
    }
    // add point
    this._pts.push(pt);
    // change rect
    s.x = newStart.x; s.y = newStart.y;
    e.x = newEnd.x; e.y = newEnd.y;
    // w & h changed
    w = b.w();
    h = b.h();
    // back to relative
    for (i = 0; i < this._pts.length; i++) {
      p = this._pts[i];
      if (w === 0) {
        p.x = 0;
      } else {
        p.x = (p.x - s.x)/w;
      }
      if (h === 0) {
        p.y = 0;
      } else {
        p.y = (p.y - s.y)/h;
      }
    }
  } else {
    w = b.w();
    h = b.h();
    if (w === 0) {
      pt.x = 0;
    } else {
      pt.x = (pt.x - s.x)/w;
    }
    if (h === 0) {
      pt.y = 0;
    } else {
      pt.y = (pt.y - s.y)/h;
    }
    this._pts.push(pt);
  }
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
                         var p = new Point(pt.x*w+tx, pt.y*h+ty);
                         //alert(p.x + ' ' + p.y);
                         return p;
                       });
};

FreeLine.prototype.getMainPoints = function () {
  return this.getPoints();
};

FreeLine.prototype.draw = function (c) {
  var ctx = c.getContext('2d');
  ctx.save();
  var pts = this.getPoints();
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  var i = 0;
  for (i = 0; i + 2 < pts.length; i += 3) {
    ctx.bezierCurveTo(pts[i].x, pts[i].y, pts[i+1].x, pts[i+1].y,
                      pts[i+2].x, pts[i+2].y);
  }
  var remaining = pts.length - i;
  if (remaining == 2) {
    // quadratic curve
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, pts[i+1].x, pts[i+1].y);
  } else {
    if (remaining == 1) {
      // straight line
      ctx.lineTo(pts[i].x, pts[i].y);
    }
  } // else remaining == 0, nothing to do
  this.getBorderColour().applyToContext(ctx);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};

/**
 * @constructor
 * A bezier curve
 */
function BezierCurve () {
  FreeLine.call(this);
}

BezierCurve.prototype = new FreeLine();

/**
 * @constructor
 * A graphic text
 */
function Text (txt) {
  Figure.call(this);
  this._txt = txt;
  this._fillColour = new TextColour(0, 0, 0, new Opacity(1));
  this._font = new TextFont('sans-serif');
  // check for text support
  var hasSupport = false;
  var c = document.createElement('canvas');
  if (c && c.getContext) {
    c = c.getContext('2d');
    if (c && c.fillText && c.strokeText) {
      hasSupport = true;
    }
  }
  if (!hasSupport) {
    this.draw = Text.prototype.fallbackDraw;
    // used to cheat Rectangle.prototype.draw and reuse it
    this.getFillColour = this.getTextColour;
  }
}

Text.prototype = new Figure();

Text.accessors('_txt', 'getText', 'setText');
Text.accessors('_font', 'getFont', 'setFont');
Text.reader('_fillColour', 'getTextColour');

Text.prototype.eachProperty = function (fn) {
  Figure.prototype.eachProperty.call(this, fn);
  fn.call(this, this._font);
  fn.call(this, this._colour);
};

Text.prototype.getMainPoints = function () {
  // it's the same
  Rectangle.prototype.getMainPoints.call(this);
};

Text.prototype.draw = function (c) {
  var ctx = c.getContext('2d');
  ctx.save();
  var b = this.getBounds();
  ctx.font = Math.abs(b.h()) + 'px ' + this._font.toCSS();
  var x = b.start().x < b.end().x ? b.start().x : b.end().x;
  var y = b.start().y > b.end().y ? b.start().y : b.end().y;
  this.getTextColour().applyToContext(ctx);
  ctx.beginPath();
  ctx.fillText(this._txt, x, y, Math.abs(b.w()));
  this.getBorderColour().applyToContext(ctx);
  ctx.strokeText(this._txt, x, y, Math.abs(b.w()));
  ctx.closePath();
  ctx.restore();
};

/*
 * Method used to draw a text when there is no support for text
 * It just draws a filled rectangle
 */
Text.prototype.fallbackDraw = function (c) {
  Rectangle.prototype.draw.call(this, c);
};
