$(document).ready(function(){

var canvas = document.getElementById("cv");
var ctx = canvas.getContext("2d");   //prendo il contesto

var canvasLeft = ctx.canvas.offsetLeft;
var canvasTop = ctx.canvas.offsetTop;
//var figures = [];
var polygonEdgeNumber=3;
var Set=new FigureSet();



function refresh(){
  //  alert("Elementi array:"+Set._figures.length);
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
  $("#cv").bind("click", function(e){
      refresh();
      deselectAll();
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

$("#bezierButton").click(function () {
  $("#cv").unbind('mousedown click mouseup');
  var c = new StraightLine();
  $("#cv").bind("mousedown", function(e){
      var sx = e.pageX-canvasLeft;
      var top = e.pageY-canvasTop;

      c.getBorderColour().set(0, 0, 255, new Opacity(1));
      c.getBounds().setStart(new Point(sx, top));
      }).bind("mouseup",function(e){
		var sx1 = e.pageX-canvasLeft;
		var top1 = e.pageY-canvasTop;
		c.getBounds().setEnd(new Point(sx1,top1));
		Set.add(c);
		refresh();

    });

});

///////////////////////////////////////////////////////////////////////////

$("#squareButton").click(function () {
  $("#cv").unbind('mousedown click mouseup');
  var c = new Rectangle();
  $("#cv").bind("mousedown", function(e){
      var sx = e.pageX-canvasLeft;
      var top = e.pageY-canvasTop;

      c.getBorderColour().set(255, 0, 0, new Opacity(1));
       c.getBounds().setStart(new Point(sx, top));


	/*	  $("#cv").bind("mousemove",function(e){
			    var re=new Rectangle();
			    var sx2 = e.pageX-canvasLeft;
			    var top2 = e.pageY-canvasTop;
			     re.getBounds().setEnd(new Point(sx2, top2));
			      Set.add(re);
			      Set.each(function (f) {
				f.draw(canvas);
			      });   */




		    }).bind("mouseup",function(e){
			      var sx1 = e.pageX-canvasLeft;
			      var top1 = e.pageY-canvasTop;
			      c.getBounds().setEnd(new Point(sx1, top1));
			      Set.add(c);
			      refresh();

    });

});

////////////////////////////////////////////////////////////

 $("#polygonButton").click(function () {
   $("#cv").unbind('mousedown mouseup click');
   createEdgeDialog();
   var y= new Polygon();
   $("#cv").bind("mousedown", function(e){
     var sx = e.pageX-canvasLeft;
     var top = e.pageY-canvasTop;
     y.getBorderColour().set(255, 0, 0, new Opacity(1));
     y.getBounds().setStart(new Point(sx, top));
   }).bind("mouseup",function(e){
     var sx1 = e.pageX-canvasLeft;
     var top1 = e.pageY-canvasTop;
     y.getBounds().setEnd(new Point(sx1, top1));
     y.edgeNumber().setVal(polygonEdgeNumber);
     Set.add(y);
     refresh();
   });
});

////////////////////////////////////////////////////////////////////////////////

 $("#circleButton").click(function () {
   $("#cv").unbind('mouseup mousedown click');
   var y= new Circle();
   $("#cv").bind("mousedown", function(e){
		var sx = e.pageX-canvasLeft;
		var top = e.pageY-canvasTop;
		y.getBorderColour().set(255, 0, 0, new Opacity(1));
		y.getBounds().setStart(new Point(sx, top));

		  }).bind("mouseup",function(e){
			    var sx1 = e.pageX-canvasLeft;
			    var top1 = e.pageY-canvasTop;
			    y.getBounds().setEnd(new Point(sx1, top1));
			    Set.add(y);
			    refresh();
		  });

			  });



});