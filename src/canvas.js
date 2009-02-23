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


TextButton.prototype.bindCanvas = function (toolbar,canvas,canvasObj,visual,figureSet,BorderColor,FillColor) {
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
     var f = s[0] = new Text("Canvas");
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
	 this._buttonList[7].bindCanvas(this,canvas,canvasObj,visual,figureSet,BorderColor,FillColor);
	 return;
	 }
  else if(this._buttonList[8].isSelected()==true){//text
	 this._buttonList[8].bindCanvas(this,canvas,canvasObj,visual,figureSet,BorderColor,FillColor);
	 return;
	 }

//}

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

Palette.prototype.rgbToHex= function (rgb) {
  var rgbvals = /rgb\((.+),(.+),(.+)\)/i.exec(rgb);
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

  return '#' + (
   to16( rval.toString(16)) +
   to16( gval.toString(16)) +
   to16( bval.toString(16))
  ).toUpperCase();

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
    	dialogClass: "Dialog1"

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







function BoundingRectangleSetter(){
 //TODO
}

