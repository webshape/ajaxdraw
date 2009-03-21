/**
 * Copyright (C) 2009 WebShape
 * Use, modification and distribution is subject to the GPL license
 *
 * @fileoverview
 * GUI Management
 * @author Bizzotto Piero
 * @author Dissegna Stefano
 */

/**
 * @constructor
 * The Page
 */
function Page(){
  this._browserName = $.browser.name;
  this._browserVersion = $.browser.versionNumber;
}

Page.prototype.getBrowserName = function (){
  return this._browserName;
};

Page.prototype.getBrowserVersion = function (){
  return this._browserVersion;
};

/*
 * Handles the activation of a specified stylesheet depending to the browser
 * @param {String} sheetref the name of the alternate stylesheet
 * */
Page.prototype.activateStylesheet = function (sheetref){
        var ss = null;
  if(document.getElementsByTagName) {
    ss = document.getElementsByTagName('link');}
  else if (document.styleSheets){
    ss = document.styleSheets;}
  for(var i=0;ss[i];i++){
    if(ss[i].href.indexOf(sheetref) != -1){
      ss[i].disabled = true;
      ss[i].disabled = false;
    }
  }
};

/*
* Loads a specified stylesheet depending to the browser
* */
Page.prototype.loadStylesheet = function (){
  var name = this._browserName;
  var nameComp;
  if (name=="msie"){
    nameComp = $.browser.className +".css";
    alert(nameComp); //msie7 mod.non standard, msie8 mod.standard IE8
  }
  else{
    nameComp = name+".css";
  }
  this.activateStylesheet(nameComp);
};



/**
* @constructor
* The Canvas
*/
function Canvas(){
  this._height = document.getElementById("cv").getAttribute('height');
  this._width = document.getElementById("cv").getAttribute('width');
  this._id = document.getElementById("cv");
}


/**
* Get id name of the canvas element
* @return the canvas id
*
*/
Canvas.prototype.getId = function (){
  if ($.browser.name=="msie") { // hack for internet explorer
     return window.G_vmlCanvasManager.initElement(this._id);
  }
  return this._id;
};

/**
* Clear the canvas element
*/
Canvas.prototype.clear = function () {
  if ($.browser.name=="msie") { // hack for internet explorer
    var canvas= window.G_vmlCanvasManager.initElement(this._id);
    canvas.width = canvas.width;
  }
 else{ this._id.width = this._id.width;}

};

Canvas.reader('_height','getHeight');
Canvas.reader('_width','getWidth');

Canvas.prototype.setHeight = function(val){
  this._height = val;
  document.getElementById("cv").setAttribute('height', val);
};

Canvas.prototype.setWidth = function(val){
  this._width = val;
  document.getElementById("cv").setAttribute('width', val);
};
/**
 * @constructor
 * Visualization handler
 */
function Visualization(figureSet){
  this._figureSet = figureSet;
  this._offset = new Point(0, 0);
  this._scale = new Scale(1);
}

Visualization.accessors('_offset', 'getOffset', 'setOffset');
Visualization.accessors('_scale', 'getScale', 'setScale');


/**
 * Refresh the view
 */
Visualization.prototype.refresh = function(){
  var c = document.getElementById('cv');
  if ($.browser.name=="msie") { // hack for internet explorer
    c = window.G_vmlCanvasManager.initElement(c);
  }
  var ctx = c.getContext('2d');
  this._scale.applyToContext(ctx, this._offset);

  /* Quadrato di salvataggio */
  var quad = new Rectangle();
  quad.getBorderColour().set(100, 100, 100, new Opacity(0.5));
  quad.getFillColour().set(255, 255, 255, new Opacity(1));
  quad.getBounds().setStart(new Point(0, 0));
  quad.getBounds().setEnd(new Point(1000, 1000));
  quad.draw(c);
  this._figureSet.each(function (f) {
    f.draw(c);
    if (f.isSelected()) {
      f.drawSelection(c);
    }
   });


};

Visualization.accessors('_figureSet', 'getFigureSet', 'setFigureSet');

/**
* Deselect all the figures in the figureset
* @param {FigureSet} figureSet the actual figureset
*/
Visualization.prototype.deselectAll = function (figureSet) {
  $('#setBorderCol').unbind('click');
  $('#setFillCol').unbind('click');
  $("#eraseButton").unbind('click');
  $("#toTopButton").unbind('click');
  $("#toBottomButton").unbind('click');
  $("#submitEdge").unbind('click');
  $("#submitRect").unbind('click');
  $("#submitFont").unbind('mousedown mouseup click');
  $('#cloneButton').unbind('click');
  figureSet.each(function (f){
    f.setSelection(false);
  });
};
/**
* Get the accurate coordinates of the user click on the canvas for every browser
* @param {Event} event the click event
* @return the coordinates of the click
*/
Visualization.prototype.getClickCoordsWithinTarget = function(event){
  var coords = new Point(0, 0);

  if(!event) // then we're in a non-DOM (probably IE) browser
  {
    event = window.event;
    coords.x = event.offsetX;
    coords.y = event.offsetY;
  }
  else    // we assume DOM modeled javascript
  {
    var Element = event.target ;
    var CalculatedTotalOffsetLeft = 0;
    var CalculatedTotalOffsetTop = 0 ;

    while (Element.offsetParent)
     {
       CalculatedTotalOffsetLeft += Element.offsetLeft ;
      CalculatedTotalOffsetTop += Element.offsetTop ;
       Element = Element.offsetParent ;
     }

    coords.x = event.pageX - CalculatedTotalOffsetLeft ;
    coords.y = event.pageY - CalculatedTotalOffsetTop ;
  }

        // adapt to scale & offset

  return this.getScale().scalePoint(coords, this.getOffset());
/* var f = this._scale.getFactor();
coords.x /= f;
coords.y /= f;
coords.x += this._offset.x;
coords.y += this._offset.y;



  return coords;*/
};



/**
 * Set the canvas dimensions depending to the user monitor resolution
 * @param {Canvas} canvasObj the canvas element
 * @param {Numeric} height the height of user screen resolution
 * @param {Numeric} width the width of user screen resolution
*/
Visualization.prototype.setCanvasDimension = function(canvasObj,height,width){
  if(width == 800 && height==600){
    canvasObj.setWidth(560);
    canvasObj.setHeight(310);
  }
  else if(width == 1024 && height==768){
    canvasObj.setWidth(670);
    canvasObj.setHeight(470);
  }
  else if(width == 1280 && height==800){
    canvasObj.setWidth(780);
    canvasObj.setHeight(480);
  }
  else if(width == 1440 && height==900){
    canvasObj.setWidth(1000);
    canvasObj.setHeight(600);
  }
  else if(width == 1680 && height==1050){
    canvasObj.setWidth(1000);
    canvasObj.setHeight(750);
  }
};

/**
 * Erase the selected element
 * @param {FigureSet} figureSet the set of figures
 * @param {Canvas} canvasObj the canvas element
 */
Visualization.prototype.eraseElement = function(figureSet,canvasObj){
   figureSet.each(function (f) {
     if (f.isSelected()) {
       figureSet.rem(f);
     }
     canvasObj.clear();
     visual.refresh();
   });
};


/**
 * Clone the selected element
 * @param {Figure} actualFigure the figure actually selected
 * @param {Canvas} canvasObj the canvas element
 */
Visualization.prototype.cloneElement = function(actualFigure,canvasObj){
  var clonedFigure = actualFigure.clone();
  clonedFigure.draw(canvasObj.getId());
  visual.getFigureSet().add(clonedFigure);
  //actualFigure.setSelection(false);
  visual.deselectAll(visual.getFigureSet());
  clonedFigure.setSelection(true);
  canvasObj.clear();
  visual.refresh();
  $("#cloneButton").unbind('click');
  $("#cloneButton").bind('click',function(e){
    visual.cloneElement(clonedFigure,canvasObj); //se riclona clona l'ultima
  });

};

/**
 * @constructor
 * A generic Button
 */
function Button(){
  this._selected = false;
}


/**
 * Set selection status of the button
 * @param {Boolean} val the status to set
 */
Button.prototype.setSelection = function (val) {
  this._selected = val;
};

/**
 * Get selection status of the button
 * @return {Boolean} the current selection status
 */
Button.prototype.isSelected = function () {
  return this._selected;
};

/**
 * Binds a drawing object function to the caller tool
 * @param {HTMLObj} canvas the canvas ref
 * @param {Canvas} canvasObj the canvas obj
 * @param {Visualization} visual che Visualization object
 */
Button.prototype.bindCanvas = function (toolbar,canvas,canvasObj,visual,BorderColor,FillColor) {
  toolbar.deselectAll();
  this.setSelection(true);
  $("#cloneButton").unbind('click');
  $("*").unbind('keypress');
  $("#cv").unbind('mousedown click mouseup');
  canvasObj.clear();
  visual.refresh();//per togliere un'eventuale selezione
  var s = [];
  var f;
  var self = this;
  $("#cv").bind("mousedown", function(e){
    var builder = self.getBuilder();
    s[0] = new builder();
    var f = s[0];
    var coords = visual.getClickCoordsWithinTarget(e);
    if(builder==Rectangle || builder == Circle || builder==Polygon){ //lines have no fillColour parameter
      f.getFillColour().getOpacity().setVal(document.getElementById("fillOp").value);
      f.getFillColour().fromCSS(FillColor);
    }
    f.getBorderColour().getOpacity().setVal(document.getElementById("borderOp").value);
    f.getBorderColour().fromCSS(BorderColor);
    f.getBounds().setStart(new Point(coords.x, coords.y));
    $("#cv").bind("mousemove",function(e){
      var coords2 = visual.getClickCoordsWithinTarget(e);
      f.getBounds().setEnd(new Point(coords2.x, coords2.y));
      if(builder==Polygon){
        var edgeNumber = parseInt(document.getElementById('edgeNumber').value, 10);
  if (!isNaN(edgeNumber) && edgeNumber >= 2) {
          f.edgeNumber().setVal(edgeNumber);
        }
      }
    canvasObj.clear();
    visual.refresh();
    f.draw(canvas);
  }).bind("mouseup",function(e){ //jQuery mouseup event bind
    $("#cv").unbind('mousemove mouseup mouseleave');
    var coords1 = visual.getClickCoordsWithinTarget(e);
    var f = s[0];
    f.getBounds().setEnd(new Point(coords1.x, coords1.y));
    visual.getFigureSet().add(f);
    canvasObj.clear();
    visual.refresh();
  }).bind('mouseleave', function (e) {
    $("#cv").unbind('mousemove mouseup mouseleave');
    visual.getFigureSet().add(s[0]);
    canvasObj.clear();
    visual.refresh();
    });
  });
};

/**
 * Binds a specified cursor to every tool
 * @param {String} type the figure for the cursor selection
 */
Button.prototype.bindCursor = function(type){
  if(($.browser.name!="opera")){
    switch(type){
      case "selection":
  $("#cv").css({'cursor' : 'url("images/selectDraw.png"),auto'});
      break;
      case "zoomIn":
  $("#cv").css({'cursor' : 'url("images/zoomIn.png"),auto'});
      break;
      case "zoomOut":
  $("#cv").css({'cursor' : 'url("images/zoomOut.png"),auto'});
      break;
      case "move":
  $("#cv").css({'cursor' : 'url("images/move.png"),auto'});
      break;
     case "line":
  $("#cv").css({'cursor' : 'url("images/lineDraw.png"),auto'});
      break;
       case "bezier":
  $("#cv").css({'cursor' : 'url("images/bezierDraw.png"),auto'});
      break;
    case "square":
       $("#cv").css({'cursor' : 'url("images/squareDraw.png"),auto'});
      break;
     case "circle":
       $("#cv").css({'cursor' : 'url("images/circleDraw.png"),auto'});
      break;
       case "polygon":
       $("#cv").css({'cursor' : 'url("images/polygonDraw.png"),auto'});
      break;
       case "freeline":
       $("#cv").css({'cursor' : 'url("images/freeLineDraw.png"),auto'});
      break;
     case "text":
       $("#cv").css({'cursor' : 'url("images/textDraw.png"),auto'});
      break;
     default:
    }
  }
};


/**
* @constructor
* The Clear Canvas Button
*/
function ClearCanvasButton () {
  canvasObj.clear();
  visual.getFigureSet().each(function(f){
    visual.getFigureSet().rem(f);
  });
  visual.refresh();
}


/**
 * @constructor
 * The Save Button
 */
function SaveButton () {
   var s = new SVGWriter();
   var svg = s.write(visual.getFigureSet());
   //alert(svg);
   $("#saveDestination").text(svg);
}


/**
* @constructor
* The Figure Selection button
*/
function SelectionButton () {
  Button.call(this);
}

SelectionButton.prototype = new Button();


/**
 * Handle the movement of control points
 * When oneSelected is true, also handles properties dialogs
 * @param {Point} pt point clicked
 * @param {Figure} f currently selected figure
 * @param {Boolean} oneSelected is the point on a figure?
 * @return true if a point was handled, false otherwise
 */
SelectionButton.prototype._handleCtrlPoint = function (pt, f, oneSelected) {
  var setter = null;
  var onPoint = function (p) {
    return p.dist(pt) < 10;
  };
  if (onPoint(f.getBounds().start())) {
    setter = function (newPt) {
      f.getBounds().setStart(newPt);
    };
  }
  else {
    if (onPoint(f.getBounds().end())) {
      setter = function (newPt) {
  f.getBounds().setEnd(newPt);
      };
    }
    else {
      if (f instanceof FreeLine) {
  var pts = f.getPoints();
  var found = null;
  pts.each(function (p) {
     if (onPoint(p)) {
     found = p;
     }
     });
  if (found) {
   setter = function (newPt) {
   f.move(found, newPt);
            found = newPt;
   };
  }
      }
    }
  }

  if (setter) {
    $('#cv').unbind('mousemove');
    $('#cv').bind('mousemove', function (e) {
     setter(visual.getClickCoordsWithinTarget(e));
                    canvasObj.clear();
                    visual.refresh();
     });
  }
  $('#cv').unbind('mouseup');
  $('#cv').bind('mouseup', function (e) {
                  $('#cv').unbind('mousemove mouseup');
                  if (oneSelected) {
                    f.eachProperty(function (p) {
                                     p.createWidget();
                                   });
                  }
                });

  return setter ? true : false;
};

/**
 * Binds the selection function to the caller tool
 * @param {HTMLObj} canvas the canvas ref
 * @param {Canvas} canvasObj the canvas obj
 * @param {Visualization} visual che Visualization object
 */
SelectionButton.prototype.bindCanvas = function (toolbar,canvas,canvasObj,visual) {
  var self = this;
  var figureSet = visual.getFigureSet();
  toolbar.deselectAll();
  $(".Dialog2").height(390); //per far vedere le parti di poligono e testo
  $("#cloneButton").unbind('click'); //unbind clonazione
  $("#cv").unbind(' mousedown mousemove click mouseup');
  $("*").unbind('keypress');
  $("*").bind('keypress',function(e){
    if(e.keyCode==46){
      visual.eraseElement(figureSet,canvasObj);
    }
  });
  $("#cv").bind("mousedown", function(e){
      var coords = visual.getClickCoordsWithinTarget(e);
      var coord = new Point(coords.x,coords.y);
      var actualFigure = figureSet.selectFigure(coord, visual.getScale(), visual.getOffset());
      if(actualFigure===null){
	//visual.deselectAll(figureSet);
        // is there an already selected figure?
	$("*").unbind('keypress');
	/*zona gestione cancellazione*/
	$("*").bind('keypress',function(e){
	  if(e.keyCode==46){
	    visual.eraseElement(figureSet,canvasObj);
	  }
	});
	$("#eraseButton").click(function () {
	  visual.eraseElement(figureSet,canvasObj);
	});
        figureSet.each(function (f) {
          if (f.isSelected()) {
            actualFigure = f;
          }
        });
        var keepSelection = false;
        if (actualFigure) {
          keepSelection = self._handleCtrlPoint(coord, actualFigure, false);
        }
        if (!keepSelection) {
          visual.deselectAll(figureSet);
	  canvasObj.clear();
	  visual.refresh();
        }
        // don't throw: no one will catch it
  //throw 'No figure found';
      }
      else {
        visual.deselectAll(figureSet); // only one selection a time
	/*gestione livelli */
	$("#toTopButton").click(function () {
	  figureSet.toTop(actualFigure);
	  canvasObj.clear();
	  visual.refresh();
	});

	$("#toBottomButton").click(function () {
	  figureSet.toBottom(actualFigure);
	  canvasObj.clear();
	  visual.refresh();
	});

	/*clonazione*/
	$("#cloneButton").unbind('click');
	$("#cloneButton").bind('click',function(e){
	  visual.cloneElement(actualFigure,canvasObj);
	});

	$("*").unbind('keypress');
	$("*").bind('keypress',function(e){
	  if(e.keyCode==46){
	    visual.eraseElement(figureSet,canvasObj);
	  }
	});
	$("#eraseButton").click(function () {
	  visual.eraseElement(figureSet,canvasObj);
	});
	actualFigure.setSelection(true);
	canvasObj.clear();
        visual.refresh();
        var prec = coord;
        $('#cv').bind('mousemove', function (e) {
          var pt = visual.getClickCoordsWithinTarget(e);
          var start = actualFigure.getBounds().start();
          var end = actualFigure.getBounds().end();
          var dx = pt.x - prec.x;
          var dy = pt.y - prec.y;
          start.x += dx;
	  start.y += dy;
	  end.x += dx;
	  end.y += dy;
          prec = pt;
          canvasObj.clear();
	  visual.refresh();
        });
	/*spostamento tramite tastierino numerico */
	$("*").bind('keypress',function (e){
           var start = null;
           var end = null;
	   if(e.keyCode==37){ //left
	     start = actualFigure.getBounds().start();
             end = actualFigure.getBounds().end();
	     start.x -= 5;
	     end.x -= 5;
	     prec.x-=5;
	     canvasObj.clear();
	     visual.refresh();
	   }
	   else if(e.keyCode==38){ //up
	     start = actualFigure.getBounds().start();
	     end = actualFigure.getBounds().end();
	     start.y -= 5;
	     end.y -= 5;
	     prec.y-=5;
	     canvasObj.clear();
	     visual.refresh();
	   }
	   else if(e.keyCode==39){ //right
	     start = actualFigure.getBounds().start();
             end = actualFigure.getBounds().end();
	     start.x += 5;
	     end.x += 5;
	     prec.x+=5;
	     canvasObj.clear();
	     visual.refresh();
	   }
	   else if(e.keyCode==40){ //down
	     start = actualFigure.getBounds().start();
             end = actualFigure.getBounds().end();
	     start.y += 5;
	     end.y += 5;
	     prec.y+=5;
	     canvasObj.clear();
	     visual.refresh();
	   }
	});

	self._handleCtrlPoint(coord, actualFigure, true);
        $('#cv').bind('mouseleave', function (e) {
          $('#cv').trigger('mouseup');
          $('#cv').unbind('mouseleave');
        });
      }
  });
};

/**
 * @constructor
 * The Zoom button
 */
function ZoomButton () {
  Button.call(this);
  this._inOrOut = false;
}

ZoomButton.prototype = new Button();


/**
 * @constructor
 * The Zoom In button
 */
function ZoomInButton () {
  ZoomButton.call(this);
  }

ZoomInButton.prototype = new ZoomButton();

ZoomInButton.prototype.bindCanvas = function (toolbar,canvas,canvasObj,visual) {
  toolbar.deselectAll();
  $("#cloneButton").unbind('click');
  $("#cv").unbind('mousedown click mouseup');
  $("#cv").bind("click", function(e){
    var factor = visual.getScale().getFactor();
    var oldw = canvas.width/(factor*2);
    var oldh = canvas.height/(factor*2);
    factor += 0.5;
    var w = canvas.width/(factor*2);
    var h = canvas.height/(factor*2);
    visual.getOffset().x += oldw - w;
    visual.getOffset().y += oldh - h;
    visual.setScale(new Scale(factor));
    //   alert(oldw + ", " + canvas.width/2 + ", " + visual.getOffset().x + ", " + factor);
    canvasObj.clear();
    visual.refresh();
  });
};

/**
 * @constructor
 * The Zoom Out button
 */
function ZoomOutButton () {
  ZoomButton.call(this);
  }

ZoomOutButton.prototype = new ZoomButton();

ZoomOutButton.prototype.bindCanvas = function (toolbar,canvas,canvasObj,visual,factor) {
  toolbar.deselectAll();
  $("#cloneButton").unbind('click');
  $("#cv").unbind('mousedown click mouseup');
  $("#cv").bind("click", function(e){
    var factor = visual.getScale().getFactor();
    var oldw = canvas.width/(factor*2);
    var oldh = canvas.height/(factor*2);
    if (factor > 0.5) {
      factor -= 0.5;
      var w = canvas.width/(factor*2);
      var h = canvas.height/(factor*2);
      visual.getOffset().x -= w - oldw;
      visual.getOffset().y -= h - oldh;
      visual.setScale(new Scale(factor));
    }
    canvasObj.clear();
    visual.refresh();
  });
};




/**
 * @constructor
 * Button to move the centre of the visualization
 */
function MoveViewButton () {
  Button.call(this);
}

MoveViewButton.prototype = new Button();

MoveViewButton.prototype.bindCanvas = function (toolbar,canvas,canvasObj,visual) {
  $("*").unbind('keypress');
  toolbar.deselectAll();
  $("#cloneButton").unbind('click');
  $("#cv").unbind('mousedown click mouseup');
  $("#cv").bind("mousedown", function(e){
                  var start = visual.getClickCoordsWithinTarget(e);
                  $('#cv').bind('mousemove', function (e) {
                                  var pos = visual.getClickCoordsWithinTarget(e);
                                  var dx = start.x - pos.x;
                                  var dy = start.y - pos.y;
                                  visual.getOffset().x += dx;
                                  visual.getOffset().y += dy;
                                  canvasObj.clear();
                                  visual.refresh();
                                });
                  $('#cv').bind('mouseup', function (e) {
                                  $("#cv").unbind('mousemove mouseup mouseleave');
                                });
                  $('#cv').bind('mouseleave', function (e) {
                                  $("#cv").unbind('mousemove mouseup mouseleave');
                                });
                });
};

/**
 * @constructor
 * The Scale Object
 * @param {Float} x scaling factor
 */
function Scale (x) {
  this._factor = x;
}

Scale.reader('_factor', 'getFactor');

Scale.prototype.applyToContext = function(ctx, offset) {
  ctx.scale(this._factor, this._factor);
  ctx.translate(-offset.x, -offset.y);
};

/**
 * Apply a scale to a single point
 * @param {Point} p point to scale
 * @param {Point} offset origin
 * @return {Point} new point scaled
 */
Scale.prototype.scalePoint = function (p, offset) {
  var f = this.getFactor();
  var pt = new Point(p.x, p.y);
  pt.x /= f;
  pt.y /= f;
  pt.x += offset.x;
  pt.y += offset.y;

  return pt;
};

/**
 * Reverse a scale
 * @param {Point} p scaled point
 * @param {Point} offset origin
 * @return {Point} new point unscaled
 */
Scale.prototype.toAbs = function (p, offset) {
  var f = this.getFactor();
  var pt = new Point(p.x, p.y);
  pt.x -= offset.x;
  pt.y -= offset.y;
  pt.x *= f;
  pt.y *= f;
  return pt;
};

/**
 * @constructor
 * The Straight Line drawing button
 */

function StraightLineButton () {
  Button.call(this);
}

StraightLineButton.prototype = new Button();

StraightLineButton.prototype.getBuilder = function () {
  return StraightLine;
};

/**
 * @constructor
 * The Bezier Curve button
 */
function BezierCurveButton () {
  Button.call(this);
}

BezierCurveButton.prototype = new Button();

BezierCurveButton.prototype.getBuilder = function () {
  return BezierCurve;
};

BezierCurveButton.prototype.bindCanvas = function (toolbar,canvas,canvasObj,visual,borderColour,fillColour) {
  $("#cloneButton").unbind('click');
  $("*").unbind('keypress');
  toolbar.deselectAll();
  this.setSelection(true);
  $("#cv").unbind('mousedown click mouseup');
  canvasObj.clear();
  visual.refresh();//per togliere un'eventuale selezione
  var s = [];
  //var f;
  var f = new BezierCurve();
  var self = this;
  var pointcounter = 4;
  var squareList = [];

  $("#cv").bind("mousedown", function(e){
    f.getBorderColour().getOpacity().setVal(document.getElementById("borderOp").value);
    f.getBorderColour().fromCSS(borderColour);
    var coords = visual.getClickCoordsWithinTarget(e);
    f.extend(new Point(coords.x, coords.y));
    canvasObj.clear();
    visual.refresh();
    f.draw(canvas);
    var rect = new Rectangle();
    rect.getFillColour().getOpacity().setVal(0);
    rect.getFillColour().fromCSS("#FFFFFF");
    rect.getBorderColour().getOpacity().setVal(0.7);
    rect.getBorderColour().fromCSS("#0000FF");
    rect.getBounds().setStart(new Point(coords.x-5, coords.y-5));
    rect.getBounds().setEnd(new Point(coords.x+5, coords.y+5));
    squareList.push(rect);
    for(var i=0;i< squareList.length;i++){
      squareList[i].draw(canvas);
    }
    pointcounter--;
    if( pointcounter === 0 ){
      f.draw(canvas);
      visual.getFigureSet().add(f);
      canvasObj.clear();
      visual.refresh();
      pointcounter = 4;
      f = new BezierCurve();
      toolbar.rebind(canvas,canvasObj,visual,borderColour,fillColour);
    }
  });
};


/**
 * @constructor
 * The Square drawing button
 */
function SquareButton () {
  Button.call(this);
}

SquareButton.prototype = new Button();

SquareButton.prototype.getBuilder = function () {
  return Rectangle;
};

/**
 * @constructor
 * The Circle drawing button
 */
function CircleButton () {
  Button.call(this);
}

CircleButton.prototype = new Button();

CircleButton.prototype.getBuilder = function () {
  return Circle;
};

/**
 * @constructor
 * The Polygon drawing button
 */
function PolygonButton () {
  Button.call(this);
}

PolygonButton.prototype = new Button();


PolygonButton.prototype.getBuilder = function () {
  return Polygon;
};

/**
 * @constructor
 * The FreeLine drawing button
 */
function FreeLineButton () {
  Button.call(this);
}

FreeLineButton.prototype = new Button();


FreeLineButton.prototype.getBuilder = function () {
  return FreeLine;
};

FreeLineButton.prototype.bindCanvas = function (toolbar,canvas,canvasObj,visual,borderColour) {
  $("*").unbind('keypress');
  toolbar.deselectAll();
  this.setSelection(true);
  $("#cloneButton").unbind('click');
  $("#cv").unbind('mousedown click mouseup');
  canvasObj.clear();
  visual.refresh();//per togliere un'eventuale selezione
  var s = [];
  var f;
  var self = this;
  $("#cv").bind("mousedown", function(e){
    s[0] = new FreeLine();
    var f = s[0];
    var coords = visual.getClickCoordsWithinTarget(e);
    f.getBorderColour().getOpacity().setVal(document.getElementById("borderOp").value);
    f.getBorderColour().fromCSS(borderColour);
    f.extend(new Point(coords.x, coords.y));
    $("#cv").bind("mousemove",function(e){
      var coords2 = visual.getClickCoordsWithinTarget(e);
      var minDist = 10;
      var dist = coords.dist(coords2);
      if (dist >= minDist) {
  f.extend(new Point(coords2.x, coords2.y));
  coords = coords2;
      }
      canvasObj.clear();
      visual.refresh();
      f.draw(canvas);
    }).bind("mouseup",function(e){ //jQuery mouseup event bind
      $("#cv").unbind('mousemove mouseup mouseleave');
      var coords1 = visual.getClickCoordsWithinTarget(e);
      var f = s[0];
      f.extend(new Point(coords1.x, coords1.y));
      visual.getFigureSet().add(f);
      canvasObj.clear();
      visual.refresh();
    }).bind('mouseleave', function (e) {
              $("#cv").unbind('mousemove mouseup mouseleave');
              visual.getFigureSet().add(f);
              canvasObj.clear();
              visual.refresh();
            });
 });
};





/**
 * @constructor
 * The Text drawing button
 */
function TextButton () {
  Button.call(this);
}

TextButton.prototype = new Button();


TextButton.prototype.getBuilder = function () {
  return Text;
};


TextButton.prototype.bindCanvas = function (toolbar,canvas,canvasObj,visual,BorderColor,FillColor) {
  $("*").unbind('keypress');
  toolbar.deselectAll();
  $("#cloneButton").unbind('click');
  this.setSelection(true);
   $("#cv").unbind('mousedown click mouseup');
   canvasObj.clear();
   visual.refresh();//per togliere un'eventuale selezione
   var s = [];
   var f;
   var self = this;
   $("#cv").bind("mousedown", function(e){
     s[0] = new Text(new TextString(document.getElementById("textString").value));
     var f = s[0];
     f.setFont(new TextFont(document.getElementById("fontTypeButton").value));
     var coords = visual.getClickCoordsWithinTarget(e);
     f.getBorderColour().getOpacity().setVal(document.getElementById("borderOp").value);
     f.getBorderColour().fromCSS(BorderColor);
     f.getTextColour().getOpacity().setVal(document.getElementById("borderOp").value);
     f.getTextColour().fromCSS(BorderColor);
     f.getBounds().setStart(new Point(coords.x, coords.y));

    $("#cv").bind("mousemove",function(e){
      var coords2 = visual.getClickCoordsWithinTarget(e);
      f.getBounds().setEnd(new Point(coords2.x, coords2.y));
      canvasObj.clear();
      visual.refresh();
      f.draw(canvas);
    }).bind("mouseup",function(e){ //jQuery mouseup event bind
      $("#cv").unbind('mousemove mouseup mouseleave');
      var coords1 = visual.getClickCoordsWithinTarget(e);
      var f = s[0];
      f.getBounds().setEnd(new Point(coords1.x, coords1.y));
      visual.getFigureSet().add(f);
      canvasObj.clear();
      visual.refresh();
    }).bind('mouseleave', function (e) {
      $("#cv").unbind('mousemove mouseup mouseleave');
      visual.getFigureSet().add(f);
      canvasObj.clear();
      visual.refresh();
    });
});
};



/**
 * @constructor
 * The Toolbar
 */
function Toolbar(){
  this._buttonList = [];
}
/**
 * Add a new button to the toolbar
 * @param {Button} b button to add
 */
Toolbar.prototype.add = function (b) {
  this._buttonList.push(b);
};
/**
 * Set the selected flag of every button to false
 */
Toolbar.prototype.deselectAll = function () {
  this._buttonList.each(function (f){
    f.setSelection(false);
  });
};

/**
 * Rebinds an action to a figure to update the color
 * @param {HTMLObject} canvas canvas reference
 * @param {Canvas} canvasObj the canvas Object
 * @param {Visualization} visual the visualization object
 * @param {String} BorderColor the current Border color
 * @param {String} FillColor the current Fill color
 */
Toolbar.prototype.rebind = function (canvas,canvasObj,visual,BorderColor,FillColor) {
  if(this._buttonList[3].isSelected()===true){//line
    this._buttonList[3].bindCanvas(this,canvas,canvasObj,visual,BorderColor,FillColor);
    return;
  }
  else if(this._buttonList[4].isSelected()===true){//bezier
    this._buttonList[4].bindCanvas(this,canvas,canvasObj,visual,BorderColor,FillColor);
    return;
  }
  else if(this._buttonList[5].isSelected()===true){//square
    this._buttonList[5].bindCanvas(this,canvas,canvasObj,visual,BorderColor,FillColor);
    return;
  }
  else if(this._buttonList[6].isSelected()===true){//circle
    this._buttonList[6].bindCanvas(this,canvas,canvasObj,visual,BorderColor,FillColor);
    return;
  }
  else if(this._buttonList[7].isSelected()===true){//polygon
    this._buttonList[7].bindCanvas(this,canvas,canvasObj,visual,BorderColor,FillColor);
    return;
  }
  else if(this._buttonList[8].isSelected()===true){//freeline
    this._buttonList[8].bindCanvas(this,canvas,canvasObj,visual,BorderColor);
    return;
  }
  else if(this._buttonList[9].isSelected()===true){//text
    this._buttonList[9].bindCanvas(this,canvas,canvasObj,visual,BorderColor,FillColor);
    return;
  }
};

/**
 * @constructor
 * The Palette
 */
function Palette(){}

/**
 * Change figure color by clicking on the palette's preffered color
 * @param {String} col with hex color representation
 * @param {String} prec1 previously BorderColor
 * @param {String} prec2 previously FillColor
 * @return null
 */
Palette.prototype.setColour = function (col,prec1,prec2){
  var colore = { BorderColor: prec1, FillColor: prec2};

  if( document.getElementById("comboColor").value=="border"){
    $.farbtastic("#color1").setColor(col);
   document.getElementById("color1").value=$.farbtastic("#color1").color;
    document.getElementById("borderColorNow").style.backgroundColor=col;
    colore.BorderColor=col;
  }
  else{
    $.farbtastic("#color2").setColor(col);
    document.getElementById("color2").value=$.farbtastic("#color2").color;
    document.getElementById("fillColorNow").style.backgroundColor=col;
    colore.FillColor=col;
  }

  return colore;

};
/**
 * Convert from RGB(x,x,x) format to hex format
 * @param {String} rgb with rgb color representation
 * @return the hex value
 */
Palette.prototype.rgbToHex= function (rgb){
  var rgbsplit = rgb.split(",");
  var rval = parseInt(rgbsplit[0].substr(4,3), 10);
  var gval = parseInt(rgbsplit[1], 10);
  var bval;

  if(rgbsplit[2].length==5){
    bval = parseInt(rgbsplit[2].substr(1,3), 10);
  }
  else if(rgbsplit[2].length==4){
    bval = parseInt(rgbsplit[2].substr(1,2), 10);
  }
  else if(rgbsplit[2].length==3){
    bval = parseInt(rgbsplit[2].substr(1,1), 10);
  }

  var to16 = function (x) {
    if (x < 16) {
      return '0' + x.toString(16);
    }
    else {
      return x.toString(16);
    }
  };

  return new Colour(rval, gval, bval, null).toCSS();


};

/**
 * @constructor
 * Colour Dialog
 */
function ColourDialog(col, border){
  var input;
  var opInput;
  var callback = function (e) {
    var cssColour = $(input).get(0).value;
    try {
      col.fromCSS(cssColour);
    } catch (e2) {
      // invalid colour, nothing to do
    }
    var opacity = parseFloat($(opInput).get(0).value);
    if (!isNaN(opacity) && 0.0 <= opacity && opacity <= 1.0) {
      // valid
      col.getOpacity().setVal(opacity);
    }
    canvasObj.clear();
    visual.refresh();
  };
  if (border) {
    input = '#color1';
    opInput = '#borderOp';
    $('#setBorderCol').unbind('click').click(callback);
  } else {
    input = '#color2';
    opInput = '#fillOp';
    $('#setFillCol').unbind('click').click(callback);
  }
  $(input).get(0).value = col.toCSS();
  $(opInput).get(0).value = col.getOpacity().getVal();
  $.farbtastic(input).setColor($(input).get(0).value);
}

ColourDialog.prototype.create= function(){
     $("#colorDialog").dialog({
      position: ["right","top"],
      height: 260,
      width: 230,
      resizable: false,
      dialogClass: "Dialog1"

    });

};


/**
 * @constructor
 * Properties Dialog
 */
function PropertiesDialog(){}

PropertiesDialog.prototype.create= function(){
   $("#propertiesDialog").dialog({
      position: "right",
  resizable: false,
      width: 230,
  height: 210,
  dialogClass: "Dialog2"
    });
};



/**
 * @constructor
 * Edge Number Setter
 */
function EdgeNumberSetter(en) {
  $('#edgeNumber').get(0).value = en.getVal();
  $("#edgeSetterZone").css({"display":"block"});
  $('#submitEdge').unbind('click');
  $('#submitEdge').click(function (e) {
                           var n = parseInt($('#edgeNumber').get(0).value, 10);
                           if (!isNaN(n)) {
                             en.setVal(n);
                           }
                           canvasObj.clear();
                           visual.refresh();
                         });
}

/**
 * @constructor
 * Font Style Setter
 * @param {TextFont} font the font type
 */
function FontSetter(font){
   $('#fontTypeButton').get(0).value = font.getName();
   //$("#fontSetterZone").css({"display":"block"});
   $('#submitFont').unbind('mousedown');
   $('#submitFont').bind('mousedown',function (e) {
     font.setName($('#fontTypeButton').get(0).value);
     canvasObj.clear();
     visual.refresh();
   });
}

function TextStringSetter(text){
   $('#textString').get(0).value = text.getName();
   $('#submitFont').unbind('mouseup');
   $('#submitFont').bind('mouseup',function (e) {
     text.setName($('#textString').get(0).value);
     canvasObj.clear();
     visual.refresh();
   });
}

function RotationSetter(angle){
   $('#rotationNumber').get(0).value = angle.getAngle();
   $('#submitRotation').click(function (e) {
           angle.setAngle($('#rotationNumber').get(0).value);
                        if (angle >= 0) {
     var rotation = Math.PI * angle / 180;
   }
                        else {
       var rotation = Math.PI * (360+angle) / 180;
          }

                        //canvasObj.rotate(rotation);

     canvasObj.clear();
     visual.refresh();
   });
}

function BoundingRectangleSetter(bounds){
  $('#submitRect').unbind('click');
  $('#x').get(0).value = bounds.start().x;
  $('#y').get(0).value = bounds.start().y;
  $('#DialogHeight').get(0).value = bounds.h();
  $('#DialogWidth').get(0).value = bounds.w();
  $('#submitRect').click(function (e) {
                           var x = parseFloat($('#x').get(0).value);
                           var y = parseFloat($('#y').get(0).value);
                           var h = parseFloat($('#DialogHeight').get(0).value);
                           var w = parseFloat($('#DialogWidth').get(0).value);
                           if (!isNaN(x)) {
                             bounds.start().x = x;
                           }
                           if (!isNaN(y)) {
                             bounds.start().y = y;
                           }
                           if (!isNaN(h)) {
                             bounds.end().y = bounds.start().y + h;
                           }
                           if (!isNaN(w)) {
                             bounds.end().x = bounds.start().x + w;
                           }
                           canvasObj.clear();
                           visual.refresh();
                         });
}