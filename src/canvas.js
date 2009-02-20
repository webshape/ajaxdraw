/**
 * @GUI
 * GUI Management
 * @author Bizzotto Piero
 */


/**
 * @constructor
 * The Canvas
 */
function Canvas(){
  this._height = 480;
  this._width = 760;
// this._id = $("#cv");
  this._id = document.getElementById("cv");
}


/**
 * Get id name of the canvas element
 * @return the canvas id
 *
 */
Canvas.prototype.getId = function (){
  return this._id;
};

Canvas.prototype.clear = function () {
  this._id.width = this._id.width;
};


/**
 * @constructor
 * Visualization handler
 */
function Visualization(figureSet){
  this._figureSet = figureSet;
}

Visualization.prototype.refresh = function(){
  var c = document.getElementById('cv');
   this._figureSet.each(function (f) {
       f.draw(c);
   });
};

Visualization.prototype.getFigureSet = function(){
  return this._figureSet;
};


Visualization.prototype.deselectAll = function (figureSet) {
   figureSet.each(function (f){
     f.setSelection(false);
  });
};

Visualization.prototype.getClickCoordsWithinTarget = function(event){
	var coords = { x: 0, y: 0};

	if(!event) // then we're in a non-DOM (probably IE) browser
	{
		event = window.event;
		coords.x = event.offsetX;
		coords.y = event.offsetY;
	}
	else		// we assume DOM modeled javascript
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

	return coords;
};


/**
 * @constructor
 * A generic Button
 */
function Button(){
  this._selected = false;
 // this._class = $(".toolbarButton");
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
 * @param {FigureSet} figureSet the set of figures
 * @param {Numeric} edgeNumber the number of edges if the figure to be drawn will be a polygon
 */
Button.prototype.bindCanvas = function (canvas,canvasObj,visual,figureSet,edgeNumber) {
   $("#cv").unbind('mousedown click mouseup');
   canvasObj.clear();
   visual.refresh();//per togliere un'eventuale selezione
   var s = [];
   var f;
   var self = this;
   $("#cv").bind("mousedown", function(e){
     var builder = self.getBuilder();
     var f = s[0] = new builder();
     var coords = visual.getClickCoordsWithinTarget(e);
     if(builder==Rectangle || builder == Circle || builder==Polygon){ //lines have no fillColour parameter
      f.getFillColour().getOpacity().setVal(1);
      f.getFillColour().fromCSS(FillColor);
     }
     f.getBorderColour().getOpacity().setVal(1);
     f.getBorderColour().fromCSS(BorderColor);
     f.getBounds().setStart(new Point(coords.x, coords.y));

    $("#cv").bind("mousemove",function(e){
        var coords2 = visual.getClickCoordsWithinTarget(e);
	f.getBounds().setEnd(new Point(coords2.x, coords2.y));
	if(builder==Polygon){
	  f.edgeNumber().setVal(edgeNumber);
	}
	canvasObj.clear();
	visual.refresh();
	f.draw(canvas);
    });

    }).bind("mouseup",function(e){  //jQuery mouseup event bind
      $("#cv").unbind('mousemove');
      var coords1 = visual.getClickCoordsWithinTarget(e);
      var f = s[0];
      f.getBounds().setEnd(new Point(coords1.x, coords1.y));
      visual.getFigureSet().add(f);
      canvasObj.clear();
      visual.refresh();
    });
};

/**
 * @constructor
 * The Figure Selection button
 */
function SelectionButton () {
  Button.call(this);
  this._id = document.getElementById("selectionButton");
}

SelectionButton.prototype = new Button();

SelectionButton.prototype.getId = function (){
  return this._id;
};

/**
 * Binds the selection function to the caller tool
 * @param {HTMLObj} canvas the canvas ref
 * @param {Canvas} canvasObj the canvas obj
 * @param {Visualization} visual che Visualization object
 * @param {FigureSet} figureSet the set of figures
 * @param {Numeric} edgeNumber the number of edges if the figure to be drawn will be a polygon
 */
SelectionButton.prototype.bindCanvas = function (canvas,canvasObj,visual,figureSet) {
  $("#cv").unbind('mousedown click mouseup');
  $("#cv").bind("click", function(e){
      visual.deselectAll(figureSet);
      visual.refresh();
      var coords = visual.getClickCoordsWithinTarget(e);
      var coord = new Point(coords.x,coords.y);
      var actualFigure = figureSet.selectFigure(coord);
      if(actualFigure==null){
	visual.deselectAll(figureSet);
	canvasObj.clear();
	visual.refresh();
	throw 'No figure found';
      }
      else{
	actualFigure.setSelection(true);
	//updateInfos(actualFigure);
	canvasObj.clear();
	visual.refresh();
	actualFigure.drawSelection(canvas);
      }
  });
};
/**
 * @constructor
 * The Zoom  button
 */
function ZoomButton () {
  Button.call(this);
  this._id = document.getElementById("zoomButton");
}

ZoomButton.prototype = new Button();

ZoomButton.prototype.getId = function (){
  return this._id;
};


/**
 * @constructor
 * The Straight Line drawing button
 */

function StraightLineButton () {
  Button.call(this);
  this._id = document.getElementById("straightLineButton");
}

StraightLineButton.prototype = new Button();

StraightLineButton.prototype.getId = function (){
  return this._id;
};

StraightLineButton.prototype.getBuilder = function () {
  return StraightLine;
};


/**
 * @constructor
 * The Square drawing button
 */

function SquareButton () {
  Button.call(this);
  this._id = document.getElementById("squareButton");
}

SquareButton.prototype = new Button();

SquareButton.prototype.getId = function (){
  return this._id;
};

SquareButton.prototype.getBuilder = function () {
  return Rectangle;
};

/**
 * @constructor
 * The Circle drawing button
 */
function CircleButton () {
  Button.call(this);
  this._id = document.getElementById("circleButton");
}

CircleButton.prototype = new Button();

CircleButton.prototype.getId = function (){
  return this._id;
};

CircleButton.prototype.getBuilder = function () {
  return Circle;
};

/**
 * @constructor
 * The Polygon drawing button
 */
function PolygonButton () {
  Button.call(this);
  this._id = document.getElementById("polygonButton");
}

PolygonButton.prototype = new Button();

PolygonButton.prototype.getId = function (){
  return this._id;
};

PolygonButton.prototype.getBuilder = function () {
  return Polygon;
};

/* Do not touch */
$(document).ready(function(){
  var canvasObj = new Canvas();
  var canvas = canvasObj.getId();
  if ($.browser.msie) {
    canvas=window.G_vmlCanvasManager.initElement(canvas);
  }
  var ctx = canvas.getContext("2d");   //prendo il contesto
 // var canvasLeft = ctx.canvas.offsetLeft;
//  var canvasTop = ctx.canvas.offsetTop;
  var figureSet = new FigureSet();
  var visual = new Visualization(figureSet);
  var selectionButton = new SelectionButton();
  var zoomButton = new ZoomButton();
  var straightLineButton = new StraightLineButton();
  var squareButton = new SquareButton();
  var circleButton = new CircleButton();
  var polygonButton = new PolygonButton();
  var polygonEdgeNumber = 7;

  $("#selectionButton").click(function () {
      selectionButton.bindCanvas(canvas,canvasObj,visual,figureSet);
  });

  $("#zoomButton").click(function () {
			   alert("Not yet implemented" );
  });

  $("#straightLineButton").click(function () {
      straightLineButton.bindCanvas(canvas,canvasObj,visual,figureSet);
  });

  $("#squareButton").click(function () {
      squareButton.bindCanvas(canvas,canvasObj,visual,figureSet);
  });

  $("#circleButton").click(function () {
    circleButton.bindCanvas(canvas,canvasObj,visual,figureSet);
  });

  $("#polygonButton").click(function () {
    // var edge = createEdgeDialog();
     polygonButton.bindCanvas(canvas,canvasObj,visual,figureSet,polygonEdgeNumber);
  });


function updateInfos(figure){
  document.getElementById("DialogHeight").value=figure.getBounds().h();
  document.getElementById("DialogWidth").value=figure.getBounds().w();
}

///fine
});