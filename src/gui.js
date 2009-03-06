
var visual = null; /* global */
var canvasObj = null; /* global */

/*parte di jQuery */
$(document).ready(function(){
/* Inizio creazione GUI */
  var page = new Page();
  var screenWidth = window.screen.width;
  var screenHeight = window.screen.height;
  page.loadStylesheet();
  canvasObj = new Canvas();
  var canvas = canvasObj.getId();
  var ctx = canvas.getContext("2d");   //prendo il contesto
  var figureSet = new FigureSet();
  visual = new Visualization(figureSet);
  visual.setCanvasDimension(canvasObj,screenHeight,screenWidth);
  //Toolbar Creation
  var toolbar = new Toolbar();
  var selectionButton = new SelectionButton();toolbar.add(selectionButton); // 0
  var zoomInButton = new ZoomInButton();toolbar.add(zoomInButton);//1
  var moveViewButton = new MoveViewButton(); toolbar.add(moveViewButton);//2
  var straightLineButton = new StraightLineButton();toolbar.add(straightLineButton);//3
  var bezierCurveButton = new BezierCurveButton();toolbar.add(bezierCurveButton);//4
  var squareButton = new SquareButton();toolbar.add(squareButton);//5
  var circleButton = new CircleButton();toolbar.add(circleButton);//6
  var polygonButton = new PolygonButton();toolbar.add(polygonButton);//7
  var freeLineButton = new FreeLineButton();toolbar.add(freeLineButton);//8
  var textButton = new TextButton();toolbar.add(textButton);//9
  var zoomOutButton = new ZoomOutButton();toolbar.add(zoomOutButton);//10
  var clearCanvasButton = new ClearCanvasButton();

/* Creo il colorDialog */
  var color= {  BorderColor:"#000000", FillColor:"#000000"};
  var palette = new Palette();
  /* Colore iniziale */
  var hex;
  if(page.getBrowserName()=="opera" || page.getBrowserName()=="msie"){
    hex = $("#lastPalette").css("background-color");
  }
  else{
    hex = palette.rgbToHex($("#lastPalette").css("background-color"));
  }
  color = palette.setColour(hex,color.BorderColor,color.FillColor);
  ColourDialog.prototype.create();

/* Creo dialog delle proprietà */

 // var fontTypeSetter = new FontTypeSetter();
 // var fontSetter = new FontSetter(fontTypeSetter);
 // var rotationSetter = new RotationSetter();
  var propertiesDialog = new PropertiesDialog();
  propertiesDialog.create();


/* Collegamento pulsanti toolbar in caso di cambio colore e generali*/
  $(".paletteComponent").click(function () {
    var hex2;
    if(page.getBrowserName()=="opera" || page.getBrowserName()=="msie"){
      hex2 = $(this).css("background-color");
    }
    else{
      hex2 = palette.rgbToHex($(this).css("background-color"));
    }
    color = palette.setColour(hex2,color.BorderColor,color.FillColor);
    toolbar.rebind(canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

//  $("#clearCanvasButton").click(function () {
//    visual.deselectAll(figureSet);
 //   clearCanvasButton.clearCanvas(canvasObj,visual,figureSet);
 //   canvasObj.clear();
 //   visual.refresh();
 // });

  $("#selectionButton").click(function () {
    $("#edgeSetterZone").css({"display":"block"});
    $("#fontSetterZone").css({"display":"block"});
    toolbar.deselectAll();
    selectionButton.bindCursor("selection");
    selectionButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,eraseButton);
  });

  $("#zoomInButton").click(function () {
    $(".Dialog2").height(210);
    visual.deselectAll(figureSet);
    zoomInButton.bindCursor("zoomIn");
    $("#fontSetterZone").css({"display":"none"});
    $("#edgeSetterZone").css({"display":"none"});
    zoomInButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet);
  });
    $("#zoomOutButton").click(function () {
    $(".Dialog2").height(210);
    visual.deselectAll(figureSet);
    zoomInButton.bindCursor("zoomOut");
    $("#fontSetterZone").css({"display":"none"});
    $("#edgeSetterZone").css({"display":"none"});
    zoomOutButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet);
  });

  $("#moveViewButton").click(function () {
    visual.deselectAll(figureSet);
    moveViewButton.bindCursor("move");
    $("#fontSetterZone").css({"display":"none"});
    $("#edgeSetterZone").css({"display":"none"});
      moveViewButton.bindCanvas(toolbar,canvas,canvasObj,visual);
  });

  $("#straightLineButton").click(function () {
    visual.deselectAll(figureSet);
    $(".Dialog2").height(210);
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"none"});
    toolbar.deselectAll();
    straightLineButton.bindCursor("line");
    straightLineButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#bezierCurveButton").click(function () {
    visual.deselectAll(figureSet);
    $(".Dialog2").height(210);
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"none"});
    toolbar.deselectAll();
    bezierCurveButton.bindCursor("bezier");
    bezierCurveButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#squareButton").click(function () {
    visual.deselectAll(figureSet);
    $(".Dialog2").height(210);
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"none"});
    toolbar.deselectAll();
    squareButton.bindCursor("square");
    squareButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#circleButton").click(function () {
    visual.deselectAll(figureSet);
    $(".Dialog2").height(210);
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"none"});
    circleButton.bindCursor("circle");
    toolbar.deselectAll();
    circleButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#polygonButton").click(function () {
    visual.deselectAll(figureSet);
    $(".Dialog2").height(300);
    $("#edgeSetterZone").css({"display":"block"});
    $("#fontSetterZone").css({"display":"none"});
    circleButton.bindCursor("polygon");
    toolbar.deselectAll();
    //edgeNumberSetter.create();
    polygonButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#freeLineButton").click(function () {
    visual.deselectAll(figureSet);
    $(".Dialog2").height(210);
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"none"});
    toolbar.deselectAll();
    freeLineButton.bindCursor("freeline");
    freeLineButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
  });

  $("#textButton").click(function () {
    visual.deselectAll(figureSet);
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"block"});
    $(".Dialog2").height(300);
    toolbar.deselectAll();
    textButton.bindCursor("text");
    textButton.bindCanvas(toolbar,canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);

  });

  $(".toolbarButton").click(function(){
    $(".toolbarButton").css({"background-color":"#F4F3F2"}); //tutti grigio chiaro
    $(this).css({"background-color":"#A0A0A0"});  //pulsante premuto grigio scuro
  });

/*Animazione tooltip su pulsante toolbar ritardata di 1 secondo*/
  $("*").tooltip(
    {delay: 750}
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
      $("#colory").css({"display":"none"});

      if(openFill === false){
	$(".Dialog1").height(430);
      }
      else {
        $(".Dialog1").height(700);
      }
      openBorder = true;
    },
    function() {
      $(".Dialog1").height(190);
      $("#colorx").hide("slow");
      $.farbtastic("#color1").setColor(document.getElementById("color1").value);
      color.BorderColor=$.farbtastic("#color1").color;
      document.getElementById("borderColorNow").style.backgroundColor=color.BorderColor;
      toolbar.rebind(canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
      if(openFill === false){
	$(".Dialog1").height(190);
      }
      else {
        $(".Dialog1").height(430);
      }
      openBorder = false;
    }
  );
  $("#changeFillCol").toggle(
    function () {
      $("#colory").show("slow");
      if(openBorder === false){
	$(".Dialog1").height(430);
     }
      else {
        $(".Dialog1").height(670);
      }
      openFill = true;
    },
    function() {
      $(".Dialog1").height(190);
      $("#colory").hide("slow");
      $.farbtastic("#color2").setColor(document.getElementById("color2").value);
      color.FillColor=$.farbtastic("#color2").color;
      document.getElementById("fillColorNow").style.backgroundColor=color.FillColor;
      toolbar.rebind(canvas,canvasObj,visual,figureSet,color.BorderColor,color.FillColor);
      if(openBorder === false){
	$(".Dialog1").height(190);
      }
      else {
        $(".Dialog1").height(430);
      }
      openFill = false;
    }
  );










  //Save & Load Dialogs handlers
 $("#saveButton").click(function () {
   $("#saveDialog").dialog( 'close' );
   //TODO save link to server
     var  s = new SVGWriter();
     var  svg = (s.write(figureSet));
     document.write(svg);
 });

 $("#loadButton").click(function () {
  //TODO load link to server
   $("#loadDialog").dialog( 'close' );
 });

  // $("#eraseButton").click(function () {
    // eraseButton.eraseElement(figureSet);
  // });




/*Componenti non utilizzabili in certe versioni di browsers*/
   if((page.getBrowserName()=="firefox" && page.getBrowserVersion()<3.1) || page.getBrowserName()=="opera" ){
     $("#fontTypeButton").css({"display":"none"});
   }


//fine documento
});
