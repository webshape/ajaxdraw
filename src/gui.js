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
/* Inizio creazione GUI */
  var page = new Page();
  page.loadStylesheet();
  var canvasObj = new Canvas();
  var canvas = canvasObj.getId();

  var ctx = canvas.getContext("2d");   //prendo il contesto
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
  var textButton = new TextButton();toolbar.add(textButton);
  var clearCanvasButton = new ClearCanvasButton();toolbar.add(clearCanvasButton);
/* Creo il colorDialog */
  var color= {  BorderColor:"#000000", FillColor:"#000000"};
  var palette = new Palette();
  var hex = palette.rgbToHex($("#lastPalette").css("background-color"));
  color = palette.setColour(hex,color.BorderColor,color.FillColor);
  var colourDialog = new ColourDialog();
  colourDialog.create();

/* Creo dialog delle proprietà */
  var edgeNumberSetter = new EdgeNumberSetter();
  //edgeNumberSetter.create();
  $("#edgeNumberDialog").dialog("close");
  var boundingRectangleSetter = new BoundingRectangleSetter();
  var fontSizeSetter = new FontSizeSetter();
  var fontTypeSetter = new FontTypeSetter();
  var fontSetter = new FontSetter(fontSizeSetter,fontTypeSetter);
  var rotationSetter = new RotationSetter();
  var propertiesDialog = new PropertiesDialog(edgeNumberSetter,fontSetter,boundingRectangleSetter,rotationSetter);
  propertiesDialog.create();






/* Collegamento pulsanti toolbar in caso di cambio colore e generali*/
  $(".paletteComponent").click(function () {
    var hex2 = palette.rgbToHex($(this).css("background-color"));
    color = palette.setColour(hex2,color.BorderColor,color.FillColor);
    toolbar.rebind(canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#clearCanvasButton").click(function () {
    clearCanvasButton.clearCanvas(canvasObj,visual,figureSet);
  });

  $("#selectionButton").click(function () {
    $("#fontSetterZone").css({"display":"none"});
    $("#edgeSetterZone").css({"display":"none"});
    toolbar.deselectAll();
    selectionButton.bindCursor("selection");
    selectionButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet);
  });

  $("#zoomButton").click(function () {
    $("#fontSetterZone").css({"display":"none"});
    $("#edgeSetterZone").css({"display":"none"});
      zoomButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,ctx);
  });

  /*$("#scaleButton").click(function () {
      scale.setZoom(ctx,canvas);
  });
*/


  $("#straightLineButton").click(function () {
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"none"});
    toolbar.deselectAll();
    straightLineButton.bindCursor("line");
    straightLineButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#bezierCurveButton").click(function () {
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"none"});
    toolbar.deselectAll();
    bezierCurveButton.bindCursor("bezier");
    bezierCurveButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#squareButton").click(function () {
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"none"});
    toolbar.deselectAll();
    squareButton.bindCursor("square");
    squareButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#circleButton").click(function () {
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"none"});
    circleButton.bindCursor("circle");
    toolbar.deselectAll();
    circleButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#polygonButton").click(function () {
    $("#edgeSetterZone").css({"display":"block"});
    $("#fontSetterZone").css({"display":"none"});
    circleButton.bindCursor("polygon");
    toolbar.deselectAll();
    edgeNumberSetter.create();
    polygonButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#freeLineButton").click(function () {
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"none"});
    toolbar.deselectAll();
    freeLineButton.bindCursor("freeline");
    freeLineButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#textButton").click(function () {
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"block"});
    toolbar.deselectAll();
    textButton.bindCursor("text");
    textButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor,fontSetter);

  });

  $(".toolbarButton").click(function(){
    $(".toolbarButton").css({"background-color":"#F4F3F2"}), //tutti grigio chiaro
    $(this).css({"background-color":"#A0A0A0"});  //pulsante premuto grigio scuro
  });

/*Animazione tooltip su pulsante toolbar ritardata di 1 secondo*/
  $(".toolbarButton").tooltip(
    {delay: 1000}
  );
  $(".toolbarButton").hover(
    function(){
      $(this).fadeOut(100);
      $(this).fadeIn(200);
    }
  );

/* Ruota dei colori **********************/
  $("#picker1").farbtastic("#color1");
  $("#picker2").farbtastic("#color2");

/* cambio colore al click su farbtastic */
  var openBorder = false;
  var openFill = false;
  $("#changeBorderCol").toggle(
    function () {
      $("#colorx").show("slow");

      if(openFill == false){
	$(".Dialog1").height(430);
      }
      else $(".Dialog1").height(650);
      openBorder = true;
    },
    function() {
      $(".Dialog1").height(210),
      $("#colorx").hide("slow");
      $.farbtastic("#color1").setColor(document.getElementById("color1").value);
      color.BorderColor=$.farbtastic("#color1").color;
      document.getElementById("borderColorNow").style.backgroundColor=color.BorderColor;
      toolbar.rebind(canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
      if(openFill == false){
	$(".Dialog1").height(210);
      }
      else $(".Dialog1").height(430);


      openBorder = false;
    }
  );
  $("#changeFillCol").toggle(
    function () {
      $("#colory").show("slow");
      if(openBorder==false){
	$(".Dialog1").height(430);
      }
      else $(".Dialog1").height(650);
      openFill = true;
    },
    function() {
      $(".Dialog1").height(210),
      $("#colory").hide("slow");
      $.farbtastic("#color2").setColor(document.getElementById("color2").value);
      color.FillColor=$.farbtastic("#color2").color;
      document.getElementById("fillColorNow").style.backgroundColor=color.FillColor;
      toolbar.rebind(canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
      if(openBorder==false){
	$(".Dialog1").height(210);
      }
      else $(".Dialog1").height(430);
      openFill = false;
    }
  );


function updateInfos(figure){
  document.getElementById("DialogHeight").value=figure.getBounds().h();
  document.getElementById("DialogWidth").value=figure.getBounds().w();
}



//fine documento
});