$(document).ready(function(){

var canvas = document.getElementById("cv");
var ctx = canvas.getContext("2d");   //prendo il contesto

var canvasLeft = ctx.canvas.offsetLeft;
var canvasTop = ctx.canvas.offsetTop;
var figures = [];
var polygonEdgeNumber=3;
var toolSelected = new Array();
		    toolSelected[0]=false; //selectionButton
		    toolSelected[1]=false; //zoomButton
		    toolSelected[2]=false;//bezierButton
		    toolSelected[3]=false;//squareButton
		    toolSelected[4]=false;//circleButton
		    toolSelected[5]=false;//polygonButton
		    toolSelected[6]=false;//freeHandButton

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
				      figures.push(c);
				      figures.each(function (f) {
					f.draw(canvas);
				      });

    });

});



$("#squareButton").click(function () {
			     $("#cv").unbind('mousedown click mouseup');
		var c = new Rectangle();
    $("#cv").bind("mousedown", function(e){
      var sx = e.pageX-canvasLeft;
      var top = e.pageY-canvasTop;

      c.getBorderColour().set(255, 0, 0, new Opacity(1));
       c.getBounds().setStart(new Point(sx, top));


			     }).bind("mouseup",function(e){
				        var sx1 = e.pageX-canvasLeft;
				       var top1 = e.pageY-canvasTop;

				    c.getBounds().setEnd(new Point(sx1, top1));
				      figures.push(c);
				      figures.each(function (f) {
					f.draw(canvas);
				      });

    });

});



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
			    figures.push(y);
			    figures.each(function (f) {
			      f.draw(canvas);
			    });
		  });





});



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
			    figures.push(y);
			    figures.each(function (f) {
			      f.draw(canvas);
			    });
		  });

			  });



});