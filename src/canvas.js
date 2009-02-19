$(document).ready(function(){

var canvas = document.getElementById("cv");
var ctx = canvas.getContext("2d");   //prendo il contesto
var canvasLeft = ctx.canvas.offsetLeft;
var canvasTop = ctx.canvas.offsetTop;
var polygonEdgeNumber = 3;
var Set=new FigureSet();



function refresh(){
  // alert("Elementi array:"+Set._figures.length);
  Set.each(function (f) {
    f.draw(canvas);
  });
}
function deselectAll(){
  Set.each(function (f){
    f.setSelection(false);
  });
}

function clear(){
  canvas.width=canvas.width;
}
function updateInfos(figure){
  document.getElementById("DialogHeight").value=figure.getBounds().h();
  document.getElementById("DialogWidth").value=figure.getBounds().w();
}


/////////////////////////////////////////
$("#selectionButton").click(function () {
  $("#cv").unbind('mousedown click mouseup');

  $("#cv").bind("click", function(e){
      deselectAll();
      refresh();
      var sx = e.pageX-canvasLeft;
      var top = e.pageY-canvasTop;
      var coord = new Point(sx,top);
      var actualFigure = Set.selectFigure(coord);
      actualFigure.setSelection(true);
      updateInfos(actualFigure);
		  clear();
		  refresh();
      actualFigure.drawSelection(canvas);
		  if(actualFigure==null){
		    throw 'No figure found';
		  }
	//	  else {
	//	    alert("trovato niente");
	//	  }
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

   });

});