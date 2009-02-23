/*function edgeNumberSetter(value){
  polygonEdgeNumber=value;
}*/



/*function createEdgeDialog(){
  $("#edgeNumberDialog").dialog({
   // position: ["right","top"],
    height: 100,
    width:320,
    dialogClass: "edgeDialog"
    });

 $("#edgeSetter").click(function () {
	edgeNumberSetter( parseInt(document.getElementById("edgeNumber").value,10));
	$("#edgeNumberDialog").dialog("close");

     });

} */

/* utile x coordinate*/
function setup()
{
  document.getElementById('cv').onclick=foo;
}

/*click sul canvas restituisce le coordinate della posizione cliccata*/
/* da implementare su dialog attributi */

function getClickCoordsWithinTarget(event)
{
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
}

function foo(e) {

  coords = getClickCoordsWithinTarget(e);
  document.getElementById('x').value=coords.x;
  document.getElementById('y').value=coords.y;
}

/*end coordinate*/



/*parte di jQuery */
$(document).ready(function(){


//dialog skin nera

     $('#dialog').dialog({
       autoOpen: true,
       position: ["left","bottom"],
       width: 450,
       height: 40,
       buttons:0
     });

     $("#dialog2").dialog({
       position: ["right","top"],
       height: 500,
       width: 250,
       dialogClass: "Dialog1"
     });

//end  skin black





/*Creazione dialog colore */
    //   createColDialog();
/* Creazione dialog Edge */
      // createEdgeDialog();


/*Creazione dialog proprietà */
    $("#propertiesDialog").dialog({
    	position: "right",
    	width: 230
    });




     $(".toolbarButton").hover(
       function(){
	 $(this).fadeOut(100);
	 $(this).fadeIn(200);
       }
     );



     /* Funzione gestione pulsante toolbar premuto/rilasciato*/
     $(".toolbarButton").toggle(
       function () {
	 $(".toolbarButton").css({"background-color":"#F4F3F2"}), //tutti grigio chiaro
	 $(this).css({"background-color":"#A0A0A0"});  //pulsante premuto grigio scuro
//	 $(this).effect("highlight");//effetto highlight
       },
       function() {
	 $(this).css({"background-color":"#F4F3F2"}); //torna a vecchio grigio
//	 $(this).effect("highlight");  //highlight

       }
     );
/*Animazione tooltip su pulsante toolbar ritardata di 1 secondo*/
       $(".toolbarButton").tooltip(
	 {delay: 1000}
       );


/* Inizio creazione GUI */
  var page = new Page();
  page.loadStylesheet();
  var canvasObj = new Canvas();
  var canvas = canvasObj.getId();

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
  var bezierCurveButton = new BezierCurveButton();toolbar.add(bezierCurveButton);
  var squareButton = new SquareButton();toolbar.add(squareButton);
  var circleButton = new CircleButton();toolbar.add(circleButton);
  var polygonButton = new PolygonButton();toolbar.add(polygonButton);
  var freeLineButton = new FreeLineButton();toolbar.add(freeLineButton);
  var polygonEdgeNumber = 7;
  var edgeNumberSetter = new EdgeNumberSetter();
  edgeNumberSetter.create();
  $("#edgeNumberDialog").dialog("close");


  var textButton = new TextButton();toolbar.add(textButton);


  var color= {  BorderColor:"#000000", FillColor:"#000000"};
  var palette = new Palette();
  var hex = palette.rgbToHex($("#lastPalette").css("background-color"));
  color = palette.setColour(hex,color.BorderColor,color.FillColor);

  var colourDialog = new ColourDialog();
  colourDialog.create();


  $(".paletteComponent").click(function () {
    var hex2 = palette.rgbToHex($(this).css("background-color"));
    color = palette.setColour(hex2,color.BorderColor,color.FillColor);
   // alert("arrivo qua");
    toolbar.rebind(canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });


  $("#selectionButton").click(function () {
    toolbar.deselectAll();
    selectionButton.bindCursor("selection");
      selectionButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet);
  });

  $("#zoomButton").click(function () {
    alert("Not yet implemented" );
  });

  $("#straightLineButton").click(function () {
    toolbar.deselectAll();
    straightLineButton.bindCursor("line");
    straightLineButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#bezierCurveButton").click(function () {
    toolbar.deselectAll();
    bezierCurveButton.bindCursor("bezier");
    bezierCurveButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#squareButton").click(function () {
    toolbar.deselectAll();
    squareButton.bindCursor("square");
    squareButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#circleButton").click(function () {
    circleButton.bindCursor("circle");
    toolbar.deselectAll();
    circleButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#polygonButton").click(function () {
    toolbar.deselectAll();
    edgeNumberSetter.create();
    polygonButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#freeLineButton").click(function () {
    toolbar.deselectAll();
    freeLineButton.bindCursor("text");
    freeLineButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#textButton").click(function () {
    toolbar.deselectAll();
    textButton.bindCursor("text");
    textButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);

  });




/* Ruota dei colori **********************/
    $("#picker1").farbtastic("#color1");
    $("#picker2").farbtastic("#color2");


    $("#changeBorderCol").toggle(
       function () {
	 $("#colorx").show("slow"),
         $(".Dialog1").height(500);
       },
       function() {
	$(".Dialog1").height(210),
     	$("#colorx").hide("slow");
	$.farbtastic("#color1").setColor(document.getElementById("color1").value);
	color.BorderColor=$.farbtastic("#color1").color;
	document.getElementById("borderColorNow").style.backgroundColor=color.BorderColor;
	 toolbar.rebind(canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
       }
     );


     $("#changeFillCol").toggle(
       function () {
	 $("#colory").show("slow"),
         $(".Dialog1").height(500);

       },
       function() {
	 $(".Dialog1").height(210),
     	 $("#colory").hide("slow");
	 $.farbtastic("#color2").setColor(document.getElementById("color2").value);
	 color.FillColor=$.farbtastic("#color2").color;

	 document.getElementById("fillColorNow").style.backgroundColor=color.FillColor;
	 toolbar.rebind(canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
       }
     );

function updateInfos(figure){
  document.getElementById("DialogHeight").value=figure.getBounds().h();
  document.getElementById("DialogWidth").value=figure.getBounds().w();
}



//fine documento
  });

