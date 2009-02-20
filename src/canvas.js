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


Visualization.prototype.getClickCoordsWithinTarget = function(event,canvasLeft,canvasTop){
	var coords = { x: canvasLeft, y: canvasTop};

	if(!event) // then we're in a non-DOM (probably IE) browser
	{
		event = window.event;
		coords.x = event.offsetX-canvasLeft;
		coords.y = event.offsetY-canvasTop;
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


Button.prototype.deselectAll = function (figureSet) {
   figureSet.each(function (f){
     f.setSelection(false);
  });
};



Button.prototype.bindCanvas = function (canvas,canvasObj,canvasLeft,canvasTop,visual,figureSet,type) {
   $("#cv").unbind('mousedown click mouseup');
   canvasObj.clear();
   visual.refresh();//per togliere un'eventuale selezione
   var s = [];
   var f;
   $("#cv").bind("mousedown", function(e){
     if(type=="#squareButton"){
      var f = s[0] = new Rectangle();
     }
     else if(type=="#circleButton"){
      var f = s[0] = new Circle();
     }
      var sx = e.pageX-canvasLeft;
      var top = e.pageY-canvasTop;

      f.getFillColour().getOpacity().setVal(1);
      f.getFillColour().fromCSS(FillColor);

      f.getBorderColour().getOpacity().setVal(1);
      f.getBorderColour().fromCSS(BorderColor);
      f.getBounds().setStart(new Point(sx, top));

    $("#cv").bind("mousemove",function(e){
	var sx2 = e.pageX-canvasLeft;
	var top2 = e.pageY-canvasTop;
	f.getBounds().setEnd(new Point(sx2, top2));
	canvasObj.clear();
	visual.refresh();
	f.draw(canvas);

      });

      }).bind("mouseup",function(e){
	 $("#cv").unbind('mousemove');
	var sx1 = e.pageX-canvasLeft;
	var top1 = e.pageY-canvasTop;
       var f = s[0];
	f.getBounds().setEnd(new Point(sx1, top1));
	visual.getFigureSet().add(f);
	//alert(visual.getFigureSet()._figures.lenght);
	canvasObj.clear();
	visual.refresh();

    });
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



function CircleButton () {
  Button.call(this);
  this._id = document.getElementById("circleButton");
}

CircleButton.prototype = new Button();

CircleButton.prototype.getId = function (){
  return this._id;
};




/* Do not touch */
$(document).ready(function(){
  var canvasObj = new Canvas();
  var canvas = canvasObj.getId();
  var ctx = canvas.getContext("2d");   //prendo il contesto
  var canvasLeft = ctx.canvas.offsetLeft;
  var canvasTop = ctx.canvas.offsetTop;
  var figureSet = new FigureSet();
  var visual = new Visualization(figureSet);
  var squareButton = new SquareButton();
  var circleButton = new CircleButton();


  $("#squareButton").click(function () {
      squareButton.bindCanvas(canvas,canvasObj,canvasLeft,canvasTop,visual,figureSet,"#squareButton");
  });


  $("#circleButton").click(function () {
    circleButton.bindCanvas(canvas,canvasObj,canvasLeft,canvasTop,visual,figureSet,"#circleButton");
  });



//function refresh(){
  // alert("Elementi array:"+Set._figures.length);
  //Set.each(function (f) {
    //f.draw(canvas);
 // });
//}
function deselectAll(){
  Set.each(function (f){
    f.setSelection(false);
  });
}

//function clear(){
 // canvas.width=canvas.width;
//}
function updateInfos(figure){
  document.getElementById("DialogHeight").value=figure.getBounds().h();
  document.getElementById("DialogWidth").value=figure.getBounds().w();
}


/////////////////////////////////////////
/*$("#selectionButton").click(function () {
  $("#cv").unbind('mousedown click mouseup');

  $("#cv").bind("click", function(e){
      deselectAll();
      refresh();
      var sx = e.pageX-canvasLeft;
      var top = e.pageY-canvasTop;
      var coord = new Point(sx,top);
      var actualFigure = Set.selectFigure(coord);
      if(actualFigure==null){
	deselectAll();
	clear();
	refresh();
	throw 'No figure found';
      }
      else{
	actualFigure.setSelection(true);
	updateInfos(actualFigure);
	clear();
	refresh();
	actualFigure.drawSelection(canvas);
      }
  });

});



/////////////////////////////////////////////////

$("#straightLineButton").click(function () {
  $("#cv").unbind('mousedown click mouseup');
  clear();
  refresh();//per togliere un'eventuale selezione
  var b = [];
  $("#cv").bind("mousedown", function(e){
      var f = b[0] = new StraightLine();
      var sx = e.pageX-canvasLeft;
      var top = e.pageY-canvasTop;

      f.getBorderColour().getOpacity().setVal(1);
      f.getBorderColour().fromCSS(BorderColor);
      f.getBounds().setStart(new Point(sx, top));
      }).bind("mouseup",function(e){
	var sx1 = e.pageX-canvasLeft;
	var top1 = e.pageY-canvasTop;
        var f = b[0];
	f.getBounds().setEnd(new Point(sx1,top1));
	Set.add(f);
	refresh();

    });

});
////////////////////////////////////////////////////////////

$("#squareButton").click(function () {
  $("#cv").unbind('mousedown click mouseup');
  clear();
  refresh();//per togliere un'eventuale selezione
 var s = [];
   $("#cv").bind("mousedown", function(e){
      var f = s[0] = new Rectangle();
      var sx = e.pageX-canvasLeft;
      var top = e.pageY-canvasTop;

      f.getFillColour().getOpacity().setVal(1);
      f.getFillColour().fromCSS(FillColor);

      f.getBorderColour().getOpacity().setVal(1);
      f.getBorderColour().fromCSS(BorderColor);
      f.getBounds().setStart(new Point(sx, top));
      }).bind("mouseup",function(e){
	var sx1 = e.pageX-canvasLeft;
	var top1 = e.pageY-canvasTop;
        var f = s[0];
	f.getBounds().setEnd(new Point(sx1, top1));
	Set.add(f);
	refresh();
    });
});
////////////////////////////////

$("#provaButton").click(function () {
  $("#cv").unbind('mousedown click mouseup');
  clear();
  refresh();//per togliere un'eventuale selezione
 var s = [];
   $("#cv").bind("mousedown", function(e){
      var f = s[0] = new Rectangle();
      var sx = e.pageX-canvasLeft;
      var top = e.pageY-canvasTop;

      f.getFillColour().getOpacity().setVal(1);
      f.getFillColour().fromCSS(FillColor);

      f.getBorderColour().getOpacity().setVal(1);
      f.getBorderColour().fromCSS(BorderColor);


      f.getBounds().setStart(new Point(sx, top));

      $("#cv").bind("mousemove",function(e){

		   var sx2 = e.pageX-canvasLeft;
		   var top2 = e.pageY-canvasTop;
		   f.getBounds().setEnd(new Point(sx2, top2));
		   clear();
		   refresh();
		   f.draw(canvas);

      });

      }).bind("mouseup",function(e){
	$("#cv").unbind('mousemove');
	var sx1 = e.pageX-canvasLeft;
	var top1 = e.pageY-canvasTop;
        var f = s[0];
	f.getBounds().setEnd(new Point(sx1, top1));
	Set.add(f);
	clear();
	refresh();
    });
});


//////////////////////////////////////////////////////////////////////


 $("#polygonButton").click(function () {
   $("#cv").unbind('mousedown mouseup click');
   clear();
   refresh();//per togliere un'eventuale selezione
   createEdgeDialog();
   var p = [];

   $("#cv").bind("mousedown", function(e){
     var f = p[0]= new Polygon();
     var sx = e.pageX-canvasLeft;
     var top = e.pageY-canvasTop;

      f.getFillColour().getOpacity().setVal(1);
      f.getFillColour().fromCSS(FillColor);
      f.getBorderColour().getOpacity().setVal(1);
      f.getBorderColour().fromCSS(BorderColor);

     f.getBounds().setStart(new Point(sx, top));
   }).bind("mouseup",function(e){
     var sx1 = e.pageX-canvasLeft;
     var top1 = e.pageY-canvasTop;
     var f = p[0];
     f.getBounds().setEnd(new Point(sx1, top1));
     f.edgeNumber().setVal(polygonEdgeNumber);
     Set.add(f);
     refresh();
   });
});

////////////////////////////////////////////////////////////////////////////////

 $("#circleButton").click(function () {
   $("#cv").unbind('mouseup mousedown click');
   clear();
   refresh();//per togliere un'eventuale selezione
   var y = [];
   $("#cv").bind("mousedown", function(e){
        var c = y[0] = new Circle();
	var sx = e.pageX-canvasLeft;
	var top = e.pageY-canvasTop;
	c.getFillColour().getOpacity().setVal(1);
	c.getFillColour().fromCSS(FillColor);
	c.getBorderColour().getOpacity().setVal(1);
	c.getBorderColour().fromCSS(BorderColor);
	c.getBounds().setStart(new Point(sx, top));
   }).bind("mouseup",function(e){
     var sx1 = e.pageX-canvasLeft;
     var top1 = e.pageY-canvasTop;
     var c = y[0];
     c.getBounds().setEnd(new Point(sx1, top1));
     Set.add(c);
     refresh();
   });

   });*/

});