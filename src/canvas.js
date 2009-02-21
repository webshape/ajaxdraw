/**
 * @GUI
 * GUI Management
 * @author Bizzotto Piero
 */

/**
 * @constructor
 * The Page
 */
function Page(){
  this._browserName = $.browser.name;
  this._browserVersion = $.browser.version;
  this._widgets = [];
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
	if(document.getElementsByTagName) {
		var ss = document.getElementsByTagName('link');}
	else if (document.styleSheets){
		var ss = document.styleSheets;}
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
  var nameComp = name+".css";
  this.activateStylesheet(nameComp);
};



/**
 * @constructor
 * The Canvas
 */
function Canvas(){
  this._height = 480;
  this._width = 760;
  this._id = document.getElementById("cv");
}


/**
 * Get id name of the canvas element
 * @return the canvas id
 *
 */
Canvas.prototype.getId = function (){
  if ($.browser.msie) { // hack for internet explorer
     return window.G_vmlCanvasManager.initElement(this._id);
  }
  return this._id;
};

Canvas.prototype.clear = function () {
   if ($.browser.msie) { // hack for internet explorer
    var canvas= window.G_vmlCanvasManager.initElement(this._id);
     canvas.width = canvas.width;
  }
 else{ this._id.width = this._id.width;}

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
  if ($.browser.msie) { // hack for internet explorer
    c = window.G_vmlCanvasManager.initElement(c);
  }
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
/**
 * Get the accurate coordinates of the user click on the canvas for every browser
 * @param {Event} event the click event
 * @return the coordinates of the click
 */
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
 */
Button.prototype.bindCanvas = function (canvas,canvasObj,visual,figureSet) {
  this.setSelection(true);
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
          var edgeNumber = document.getElementById('edgeNumber').value;
          // TODO: check that edgeNumber is a valid number
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

/*
 * Binds a specified cursor to every tool
 */
Button.prototype.bindCursor = function(type){
  if(($.browser.name!="opera")){
    switch(type){
      case "selection":
	$("#cv").css({'cursor' : 'url("images/selezione.png"),auto'});
      break;
     case "line":
	$("#cv").css({'cursor' : 'url("images/lineDraw.png"),auto'});
      break;

    case "square":
       $("#cv").css({'cursor' : 'url("images/squareDraw.png"),auto'});
      break;
     case "circle":
       $("#cv").css({'cursor' : 'url("images/circleDraw.png"),auto'});
      break;
     case "text":
       $("#cv").css({'cursor' : 'text'});
      break;
     default:
      alert("fatto");
    }
  }
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


/**
 * @constructor
 * The Text drawing button
 */
function TextButton () {
  Button.call(this);
  this._id = document.getElementById("textButton");
}

TextButton.prototype = new Button();

TextButton.prototype.getId = function (){
  return this._id;
};

TextButton.prototype.getBuilder = function () {
  return Text;
};

TextButton.prototype.bindCanvas = function (canvas,canvasObj,visual,figureSet) {
  this.setSelection(true);
   $("#cv").unbind('mousedown click mouseup');
   canvasObj.clear();
   visual.refresh();//per togliere un'eventuale selezione
   var s = [];
   var f;
   var self = this;
   $("#cv").bind("mousedown", function(e){
   //  var builder = self.getBuilder();
     var f = s[0] = new Text("prova");
     var coords = visual.getClickCoordsWithinTarget(e);
     f.getFillColour().getOpacity().setVal(1);
      f.getFillColour().fromCSS(FillColor);

     f.getBorderColour().getOpacity().setVal(1);
     f.getBorderColour().fromCSS(BorderColor);
     f.getTextColour().getOpacity().setVal(1);
     f.getTextColour().fromCSS(BorderColor);
     f.getBounds().setStart(new Point(coords.x, coords.y));

    $("#cv").bind("mousemove",function(e){
        var coords2 = visual.getClickCoordsWithinTarget(e);
	f.getBounds().setEnd(new Point(coords2.x, coords2.y));
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
 * The Toolbar
 */
function Toolbar(){
  this._buttonList = [];
}
/**
 * Add a new figure to the collection
 * @param {Button} b button to add
 */
Toolbar.prototype.add = function (b) {
  this._buttonList.push(b);
};

Toolbar.prototype.deselectAll = function () {
   this._buttonList.each(function (f){
     f.setSelection(false);
  });
};

//Colors
/**
 * @constructor
 * The Palette single color
 */
function PaletteColor(color){
  this._color = color;
}


/**
 * @constructor
 * The Palette
 */
function Palette(){
  this._colorList = [];
}

/**
 * Add a new color to the collection
 * @param {PaletteColor} p color to add
 */
Palette.prototype.add = function (p) {
  this._colorList.push(p);
};


/**
 * @constructor
 * Colour Dialog
 */
function ColourDialog(){
 //TODO
}





/* Do not touch */
$(document).ready(function(){
  var page = new Page();
  page.loadStylesheet();
  var canvasObj = new Canvas();
  var canvas = canvasObj.getId();

 // if ($.browser.msie) { // hack for internet explorer
 //   canvas=window.G_vmlCanvasManager.initElement(canvas);
 // }

  var ctx = canvas.getContext("2d");   //prendo il contesto
  //var canvasLeft = ctx.canvas.offsetLeft;
  //var canvasTop = ctx.canvas.offsetTop;
  var figureSet = new FigureSet();
  var visual = new Visualization(figureSet);
  //Toolbar Creation
  var toolbar = new Toolbar();
  var selectionButton = new SelectionButton();toolbar.add(selectionButton);
  var zoomButton = new ZoomButton();toolbar.add(zoomButton);
  var straightLineButton = new StraightLineButton();toolbar.add(straightLineButton);
  var squareButton = new SquareButton();toolbar.add(squareButton);
  var circleButton = new CircleButton();toolbar.add(circleButton);
  var polygonButton = new PolygonButton();toolbar.add(polygonButton);
  var polygonEdgeNumber = 7;
  var textButton = new TextButton();toolbar.add(textButton);

  $("#selectionButton").click(function () {
    toolbar.deselectAll();
    selectionButton.bindCursor("selection");
    selectionButton.bindCanvas(canvas,canvasObj,visual,figureSet);
  });

  $("#zoomButton").click(function () {
    alert("Not yet implemented" );
  });

  $("#straightLineButton").click(function () {
    toolbar.deselectAll();
    straightLineButton.bindCursor("line");
    straightLineButton.bindCanvas(canvas,canvasObj,visual,figureSet);
  });

  $("#squareButton").click(function () {
    toolbar.deselectAll();
    squareButton.bindCursor("square");
    squareButton.bindCanvas(canvas,canvasObj,visual,figureSet);
  });

  $("#circleButton").click(function () {
    circleButton.bindCursor("circle");
    toolbar.deselectAll();
    circleButton.bindCanvas(canvas,canvasObj,visual,figureSet);
  });

  $("#polygonButton").click(function () {
    toolbar.deselectAll();
    var edge = createEdgeDialog(polygonEdgeNumber);
    polygonButton.bindCanvas(canvas,canvasObj,visual,figureSet);
  });

  $("#textButton").click(function () {
    toolbar.deselectAll();
    textButton.bindCursor("text");
    textButton.bindCanvas(canvas,canvasObj,visual,figureSet);

  });


function updateInfos(figure){
  document.getElementById("DialogHeight").value=figure.getBounds().h();
  document.getElementById("DialogWidth").value=figure.getBounds().w();
}

///fine
});