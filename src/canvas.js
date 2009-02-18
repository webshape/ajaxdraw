$(document).ready(function(){

var canvas = document.getElementById("cv");
var ctx = canvas.getContext("2d");   //prendo il contesto
var canvasLeft = ctx.canvas.offsetLeft;
var canvasTop = ctx.canvas.offsetTop;
var polygonEdgeNumber = 3;
var boolTool = new Array;
var Set=new FigureSet();
boolTool[0]=false;
boolTool[1]=false;
boolTool[2]=false;
boolTool[3]=false;
boolTool[4]=false;


function refresh(){
  // alert("Elementi array:"+Set._figures.length);
  Set.each(function (f) {
    f.draw(canvas);
  });
}
function deselectAll(){
  Set.each(function (f){
    f.setSelection(false);
   // f.drawSelection(canvas);
  });
}


/////////////////////////////////////////
$("#selectionButton").click(function () {
  $("#cv").unbind('mousedown click mouseup');
        canvas.width=canvas.width;
      refresh();

  $("#cv").bind("click", function(e){
   //   deselectAll();
      var sx = e.pageX-canvasLeft;
      var top = e.pageY-canvasTop;
      var coord = new Point(sx,top);
      var actualFigure = Set.selectFigure(coord);
      actualFigure.setSelection(true);
      actualFigure.drawSelection(canvas);
	//	  if(actualFigure!=null){
	//	    alert("trovata figura");
	//	  }
	//	  else {
	//	    alert("trovato niente");
	//	  }
  });

});



/////////////////////////////////////////////////
var bez=new Array;
var iBezier=0;
$("#bezierButton").click(function () {
  $("#cv").unbind('mousedown click mouseup');
  $("#cv").bind("mousedown", function(e){
      bez[iBezier] = new StraightLine();
      var sx = e.pageX-canvasLeft;
      var top = e.pageY-canvasTop;

      bez[iBezier].getBorderColour().set(0, 0, 255, new Opacity(1));
      bez[iBezier].getBounds().setStart(new Point(sx, top));
      }).bind("mouseup",function(e){
	var sx1 = e.pageX-canvasLeft;
	var top1 = e.pageY-canvasTop;
	bez[iBezier].getBounds().setEnd(new Point(sx1,top1));
	Set.add(bez[iBezier]);
	iBezier++;
	refresh();

    });

});
////////////////////////////////////////////////////////////
var sq=new Array;
var iSquare=0;
$("#squareButton").click(function () {
  $("#cv").unbind('mousedown click mouseup');
   $("#cv").bind("mousedown", function(e){
      sq[iSquare] = new Rectangle();
      var sx = e.pageX-canvasLeft;
      var top = e.pageY-canvasTop;
      sq[iSquare].getBorderColour().set(255, 0, 0, new Opacity(1));
      sq[iSquare].getBounds().setStart(new Point(sx, top));
      }).bind("mouseup",function(e){
	var sx1 = e.pageX-canvasLeft;
	var top1 = e.pageY-canvasTop;
	sq[iSquare].getBounds().setEnd(new Point(sx1, top1));
	Set.add(sq[iSquare]);
	iSquare++;
	refresh();
    });
});



//////////////////////////////////////////////////////////////////////


var pol=new Array;
var iPoly=0;
 $("#polygonButton").click(function () {
   $("#cv").unbind('mousedown mouseup click');
   createEdgeDialog();
   $("#cv").bind("mousedown", function(e){
     pol[iPoly]= new Polygon();
     var sx = e.pageX-canvasLeft;
     var top = e.pageY-canvasTop;
     pol[iPoly].getBorderColour().set(255, 0, 0, new Opacity(1));
     pol[iPoly].getBounds().setStart(new Point(sx, top));
   }).bind("mouseup",function(e){
     var sx1 = e.pageX-canvasLeft;
     var top1 = e.pageY-canvasTop;
     pol[iPoly].getBounds().setEnd(new Point(sx1, top1));
     pol[iPoly].edgeNumber().setVal(polygonEdgeNumber);
     Set.add(pol[iPoly]);
     iPoly++;
     refresh();
   });
});

////////////////////////////////////////////////////////////////////////////////
var cir=new Array;
var iCircle=0;
 $("#circleButton").click(function () {
   $("#cv").unbind('mouseup mousedown click');
   $("#cv").bind("mousedown", function(e){
	cir[iCircle]= new Circle();
	var sx = e.pageX-canvasLeft;
	var top = e.pageY-canvasTop;
	cir[iCircle].getBorderColour().set(255, 0, 0, new Opacity(1));
	cir[iCircle].getBounds().setStart(new Point(sx, top));
		  }).bind("mouseup",function(e){
			    var sx1 = e.pageX-canvasLeft;
			    var top1 = e.pageY-canvasTop;
			    cir[iCircle].getBounds().setEnd(new Point(sx1, top1));
			    Set.add(cir[iCircle]);
			    iCircle++;
			    refresh();
		  });

			  });



});