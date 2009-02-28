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

Canvas.prototype.getHeight = function(){
	return this._height;
};

Canvas.prototype.getWidth = function(){
	return this._width;
};

Canvas.prototype.setHeight = function(val){
	this._height = val;
	this.setAttribute('height', val);
};

Canvas.prototype.setWidth = function(val){
	this._width = val;
	this.setAttribute('width', val);
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
Visualization.writer('_scale', 'setScale');

Visualization.prototype.refresh = function(){
  var c = document.getElementById('cv');
  if ($.browser.msie) { // hack for internet explorer
    c = window.G_vmlCanvasManager.initElement(c);
  }
  var ctx = c.getContext('2d');
  this._scale.applyToContext(ctx, this._offset);
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

        // adapt to scale & offset
  var f = this._scale.getFactor();
  coords.x /= f;
  coords.y /= f;
  coords.x += this._offset.x;
  coords.y += this._offset.y;



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
Button.prototype.bindCanvas = function (toolbar,canvas,canvasObj,visual,figureSet,BorderColor,FillColor) {
  toolbar.deselectAll();
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
	$("#cv").css({'cursor' : 'url("images/selectDraw.png"),auto'});
      break;
      case "zoom":
	$("#cv").css({'cursor' : 'url("images/zoom.png"),auto'});
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
      alert("fatto");
    }
  }
};


/**
 * @constructor
 * The Clear Canvas Button
 */
function ClearCanvasButton () {
  Button.call(this);
  this._id = document.getElementById("clearCanvasButton");
}

ClearCanvasButton.prototype = new Button();

ClearCanvasButton.prototype.getId = function (){
  return this._id;
};

ClearCanvasButton.prototype.clearCanvas = function(canvas,visual,figureSet){
  canvas.clear();
  figureSet.each(function(f){
    figureSet.rem(f);
  });
  visual.refresh();
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
SelectionButton.prototype.bindCanvas = function (toolbar,canvas,canvasObj,visual,figureSet) {
  toolbar.deselectAll();

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
        // don't throw: no one will catch it
	//throw 'No figure found';
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
  this._inOrOut = false;
}

ZoomButton.prototype = new Button();

ZoomButton.prototype.getId = function (){
  return this._id;
};

ZoomButton.prototype.bindCanvas = function (toolbar,canvas,canvasObj,visual,figureSet) {
  toolbar.deselectAll();
  $("#cv").unbind('mousedown click mouseup');
  $("#cv").bind("click", function(e){
                  var factor = document.getElementById("scaleButton").value;
                  var start = visual.getClickCoordsWithinTarget(e);
                  visual.setOffset(start);
                  visual.setScale(new Scale(factor));
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
  toolbar.deselectAll();
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
                                  $("#cv").unbind('mousemove mouseup');
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
 * The Bezier Curve button
 */
function BezierCurveButton () {
  Button.call(this);
  this._id = document.getElementById("bezierCurveButton");
}

BezierCurveButton.prototype = new Button();

BezierCurveButton.prototype.getId = function (){
  return this._id;
};

BezierCurveButton.prototype.getBuilder = function () {
  return BezierCurve;
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
 * The FreeLine drawing button
 */
function FreeLineButton () {
  Button.call(this);
  this._id = document.getElementById("textButton");
}

FreeLineButton.prototype = new Button();

FreeLineButton.prototype.getId = function (){
  return this._id;
};

FreeLineButton.prototype.getBuilder = function () {
  return FreeLine;
};

FreeLineButton.prototype.bindCanvas = function (toolbar,canvas,canvasObj,visual,figureSet,borderColour) {
  toolbar.deselectAll();
  this.setSelection(true);
   $("#cv").unbind('mousedown click mouseup');
   canvasObj.clear();
   visual.refresh();//per togliere un'eventuale selezione
   var s = [];
   var f;
   var self = this;
   $("#cv").bind("mousedown", function(e){
   //  var builder = self.getBuilder();
     var f = s[0] = new FreeLine();
     var coords = visual.getClickCoordsWithinTarget(e);
     f.getBorderColour().getOpacity().setVal(1);
     f.getBorderColour().fromCSS(borderColour);
     //f.getBounds().setStart(new Point(coords.x, coords.y));
                   f.extend(new Point(coords.x, coords.y));
    $("#cv").bind("mousemove",function(e){
        var coords2 = visual.getClickCoordsWithinTarget(e);
                    var minDist = 10;
                    var dx = coords.x-coords2.x;
                    var dy = coords.y-coords2.y;
                    var dist = Math.sqrt(dx*dx+dy*dy);
	if (dist >= minDist) {
	     f.extend(new Point(coords2.x, coords2.y));
          coords = coords2;
	//f.getBounds().setEnd(new Point(coords2.x, coords2.y));
}
	canvasObj.clear();
	visual.refresh();
	f.draw(canvas);
    });

    }).bind("mouseup",function(e){  //jQuery mouseup event bind
      $("#cv").unbind('mousemove');
      var coords1 = visual.getClickCoordsWithinTarget(e);
      var f = s[0];
              f.extend(new Point(coords1.x, coords1.y));
      //f.getBounds().setEnd(new Point(coords1.x, coords1.y));
      visual.getFigureSet().add(f);
      canvasObj.clear();
      visual.refresh();
    });
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


TextButton.prototype.bindCanvas = function (toolbar,canvas,canvasObj,visual,figureSet,BorderColor,FillColor,textSetter) {
toolbar.deselectAll();
  this.setSelection(true);
   $("#cv").unbind('mousedown click mouseup');
   canvasObj.clear();
   visual.refresh();//per togliere un'eventuale selezione
   var s = [];
   var f;
   var self = this;
   $("#cv").bind("mousedown", function(e){
   //  var builder = self.getBuilder();
		   var text = textSetter.setTextString();
     var f = s[0] = new Text(text);
     f.setFont(new TextFont(textSetter.getTypeSetter().setFontType()));
     var coords = visual.getClickCoordsWithinTarget(e);
     //f.getFillColour().getOpacity().setVal(1);
     // f.getFillColour().fromCSS(FillColor);

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
 * @param {FigureSet} figureSet the set of figures
 * @param {String} BorderColor the current Border color
 * @param {String} FillColor the current Fill color
 */
Toolbar.prototype.rebind = function (canvas,canvasObj,visual,figureSet,BorderColor,FillColor) {
  //for(var i=0;i<this._buttonList.lenght;i++){
  if(this._buttonList[2].isSelected()==true){//line
    this._buttonList[2].bindCanvas(this,canvas,canvasObj,visual,figureSet,BorderColor,FillColor);
    return;
  }
  else if(this._buttonList[3].isSelected()==true){//bezier
    this._buttonList[3].bindCanvas(this,canvas,canvasObj,visual,figureSet,BorderColor,FillColor);
    return;
  }
  else if(this._buttonList[4].isSelected()==true){//square
    this._buttonList[4].bindCanvas(this,canvas,canvasObj,visual,figureSet,BorderColor,FillColor);
    return;
  }
  else if(this._buttonList[5].isSelected()==true){//circle
    this._buttonList[5].bindCanvas(this,canvas,canvasObj,visual,figureSet,BorderColor,FillColor);
    return;
  }
  else if(this._buttonList[6].isSelected()==true){//polygon
    this._buttonList[6].bindCanvas(this,canvas,canvasObj,visual,figureSet,BorderColor,FillColor);
    return;
  }
  else if(this._buttonList[7].isSelected()==true){//freeline
    this._buttonList[7].bindCanvas(this,canvas,canvasObj,visual,figureSet,BorderColor);
    return;
  }
  else if(this._buttonList[8].isSelected()==true){//text
    this._buttonList[8].bindCanvas(this,canvas,canvasObj,visual,figureSet,BorderColor,FillColor);
    return;
  }
};



//Colors
/**
 * @constructor
 * The Palette single color
 */
function PaletteComponent(color){
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
 * @param {PaletteComponent} p color to add
 */
Palette.prototype.add = function (p) {
  this._colorList.push(p);
};
/**
 * Apply a function to each color
 * @param {Function} fn function to apply
 */
Palette.prototype.each = function (fn) {
  this._figures.each(fn);
};


/**
 * Change figure color by clicking on the palette's preffered color
 * @param {String} string with hex color representation
 * @return  null
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
 * @return  the hex value
 */
Palette.prototype.rgbToHex= function (rgb){
  var rgbvals = /rgb\((.+),(.+),(.+)\)/i.exec(rgb);
//  if($.browser.name!="opera"){
  var rval = parseInt(rgbvals[1]);
  var gval = parseInt(rgbvals[2]);
  var bval = parseInt(rgbvals[3]);

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
function ColourDialog(){
 //TODO
}

ColourDialog.prototype.create= function(){
     $("#colorDialog").dialog({
    	position: ["right","top"],
    	height: 210,
    	width: 230,
	resizable: false,
    	dialogClass: "Dialog1"

    });

};


/**
 * @constructor
 * Properties Dialog
 */
function PropertiesDialog(edge,font,bounding,rotation){
  this._edgeSetter = edge;
  this._fontSetter = font;
  this._boundingSetter = bounding;
  this._rotationSetter = rotation;
}

PropertiesDialog.prototype.create= function(){
   $("#propertiesDialog").dialog({
    	position: "right",
    	width: 230,
	height: 250
    });
};



/**
 * @constructor
 * Edge Number Setter
 */
function EdgeNumberSetter(){
  this._polygonEdgeNumber=3;
}


EdgeNumberSetter.prototype.setEdgeNumber = function(value){
  this._polygonEdgeNumber=value;
};

EdgeNumberSetter.prototype.getEdgeNumber = function(){
  return this._polygonEdgeNumber;
};


EdgeNumberSetter.prototype.create = function(){
   $("#edgeNumberDialog").dialog({
   // position: ["right","top"],
    height: 100,
    width:320,
    dialogClass: "edgeDialog"
    });

   $("#edgeSetter").click(function () {
     this._polygonEdgeNumber=parseInt(document.getElementById("edgeNumber").value,10);
     $("#edgeNumberDialog").dialog("close");
   });
};



function FontSetter(size,font){
 //TODO
  this._fontSizeSetter = size;
  this._fontTypeSetter = font;
  this._text = document.getElementById("textString").value;
}

FontSetter.prototype.setTextString = function(){
  this._text = document.getElementById("textString").value;
  return this._text;
};

FontSetter.prototype.getSizeSetter = function(){
  return this._fontSizeSetter;
};

FontSetter.prototype.getTypeSetter = function(){
  return this._fontTypeSetter;
};

function FontSizeSetter(){
  this._size = document.getElementById("fontSizeButton").value;
};

function FontTypeSetter(){
  this._type = document.getElementById("fontTypeButton").value;
};

FontTypeSetter.prototype.setFontType = function(){
  this._type = document.getElementById("fontTypeButton").value;
  return this._type;
};



function RotationSetter(){
 //TODO
}

function BoundingRectangleSetter(){
 //TODO
}

