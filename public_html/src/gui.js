/**
 * Copyright (C) 2009 WebShape
 * Use, modification and distribution is subject to the GPL license
 *
 * @fileoverview
 * GUI initialization
 */

var visual = null; // global
var canvasObj = null; // global

$(document).ready(function(){
  // GUI creation
  var page = new Page();
  var screenWidth = window.screen.width; //take the screen resolution
  var screenHeight = window.screen.height;
  page.loadStylesheet();
  canvasObj = new Canvas();
  var canvas = canvasObj.getId();
  var ctx = canvas.getContext("2d"); // take the context
  var figureSet = new FigureSet();
  visual = new Visualization(figureSet);
  visual.setCanvasDimension(canvasObj,screenHeight,screenWidth);
  // Toolbar Creation
  var toolbar = new Toolbar();  //creation of the buttons & their add to the toolbar
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

  // ColourDialog creation
  var color= {  BorderColor:"#000000", FillColor:"#000000"};
  var palette = new Palette();
  // Initial colour
  var hex;
  if(page.getBrowserName()=="opera" || page.getBrowserName()=="msie"){
    hex = $("#lastPalette").css("background-color");
  }
  else{
    hex = palette.rgbToHex($("#lastPalette").css("background-color"));
  }
  color = palette.setColour(hex,color.BorderColor,color.FillColor);
  ColourDialog.prototype.create();

  // Property dialog creation
  var propertiesDialog = new PropertiesDialog();
  propertiesDialog.create();

  // Connect toolbar buttons on color change
  $(".paletteComponent").click(function () {
    var hex2;
    if(page.getBrowserName()=="opera" || page.getBrowserName()=="msie"){
      hex2 = $(this).css("background-color"); //workaround: opera & IE return hex values, while others RGB values
    }
    else{
      hex2 = palette.rgbToHex($(this).css("background-color"));//converts RGB value to hex value
    }
    color = palette.setColour(hex2,color.BorderColor,color.FillColor);
    toolbar.rebind(canvas,canvasObj,visual,color.BorderColor,color.FillColor);
  });

//Buttons bindings
  $("#selectionButton").click(function () {
    $("#edgeSetterZone").css({"display":"block"}); //show modificators in the Prop.Dialog
    $("#fontSetterZone").css({"display":"block"});
    toolbar.deselectAll();
    selectionButton.bindCursor("selection"); //bind cursor images
    selectionButton.bindCanvas(toolbar,canvas,canvasObj,visual);
  });

  $("#zoomInButton").click(function () {
    $(".Dialog2").height(210); //change Properties Dialog dimension to hide inutilities
    visual.deselectAll(figureSet);
    zoomInButton.bindCursor("zoomIn");
    $("#fontSetterZone").css({"display":"none"});
    $("#edgeSetterZone").css({"display":"none"});
    zoomInButton.bindCanvas(toolbar,canvas,canvasObj,visual);
  });
    $("#zoomOutButton").click(function () {
    $(".Dialog2").height(210);
    visual.deselectAll(figureSet);
    zoomInButton.bindCursor("zoomOut");
    $("#fontSetterZone").css({"display":"none"});
    $("#edgeSetterZone").css({"display":"none"});
    zoomOutButton.bindCanvas(toolbar,canvas,canvasObj,visual);
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
    straightLineButton.bindCanvas(toolbar,canvas,canvasObj,visual,color.BorderColor,color.FillColor);
  });

  $("#bezierCurveButton").click(function () {
    visual.deselectAll(figureSet);
    $(".Dialog2").height(210);
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"none"});
    toolbar.deselectAll();
    bezierCurveButton.bindCursor("bezier");
    bezierCurveButton.bindCanvas(toolbar,canvas,canvasObj,visual,color.BorderColor,color.FillColor);
  });

  $("#squareButton").click(function () {
    visual.deselectAll(figureSet);
    $(".Dialog2").height(210);
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"none"});
    toolbar.deselectAll();
    squareButton.bindCursor("square");
    squareButton.bindCanvas(toolbar,canvas,canvasObj,visual,color.BorderColor,color.FillColor);
  });

  $("#circleButton").click(function () {
    visual.deselectAll(figureSet);
    $(".Dialog2").height(210);
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"none"});
    circleButton.bindCursor("circle");
    toolbar.deselectAll();
    circleButton.bindCanvas(toolbar,canvas,canvasObj,visual,color.BorderColor,color.FillColor);
  });

  $("#polygonButton").click(function () {
    visual.deselectAll(figureSet);
    $(".Dialog2").height(300);
    $("#edgeSetterZone").css({"display":"block"});
    $("#fontSetterZone").css({"display":"none"});
    circleButton.bindCursor("polygon");
    toolbar.deselectAll();
    polygonButton.bindCanvas(toolbar,canvas,canvasObj,visual,color.BorderColor,color.FillColor);
  });

  $("#freeLineButton").click(function () {
    visual.deselectAll(figureSet);
    $(".Dialog2").height(210);
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"none"});
    toolbar.deselectAll();
    freeLineButton.bindCursor("freeline");
    freeLineButton.bindCanvas(toolbar,canvas,canvasObj,visual,color.BorderColor,color.FillColor);
  });

  $("#textButton").click(function () {
    visual.deselectAll(figureSet);
    $("#edgeSetterZone").css({"display":"none"});
    $("#fontSetterZone").css({"display":"block"});
    $(".Dialog2").height(300);
    toolbar.deselectAll();
    textButton.bindCursor("text");
    textButton.bindCanvas(toolbar,canvas,canvasObj,visual,color.BorderColor,color.FillColor);

  });

  $(".toolbarButton").click(function(){
    $(".toolbarButton").css({"background-color":"#F4F3F2"}); //tutti grigio chiaro
    $(this).css({"background-color":"#A0A0A0"});  //pulsante premuto grigio scuro
  });

  // Tooltip animation
  $("*").tooltip({
    delay: 750
  }); // 0.75 secs

  $(".toolbarButton").hover(
    function(){
      $(this).fadeOut(100);
      $(this).fadeIn(200);
    }
  );

  // Colour wheel implementation
  $("#picker1").farbtastic("#color1");
  $("#picker2").farbtastic("#color2");
  // Change colour on click on farbstastic
  var openBorder = false; //booleans for wheels open/close animation control,
  var openFill = false;

  if(page.getBrowserName()!="opera"){ //workaround for Opera graphics issues
    $("#changeBorderCol").toggle(
      function () {
	$("#colorx").show("slow");
	if(openFill === false){
	  if(page.getBrowserName()=="msie"){ //dimension changed because of IE farb incompatibility
	    $(".Dialog1").height(310);//applied for all resizings
	  }
	  else{
	     $(".Dialog1").height(500);
	  }
	}
	else {
	   if(page.getBrowserName()=="msie"){
	     $(".Dialog1").height(370);
	   }
	   else{
	     $(".Dialog1").height(770);
	   }
	}
	openBorder = true;
      },
      function() {
	$(".Dialog1").height(260);
	$("#colorx").hide("slow");
	$.farbtastic("#color1").setColor(document.getElementById("color1").value);//set the border color to use
	color.BorderColor=$.farbtastic("#color1").color;
	//change the square in the ColourDialog to show to the user the actual setted color
	document.getElementById("borderColorNow").style.backgroundColor = color.BorderColor;
	//rebinds the tool in use with the canvas for color changing
	toolbar.rebind(canvas,canvasObj,visual,color.BorderColor,color.FillColor);
	if(openFill === false){
	  if(page.getBrowserName()=="msie"){ //dimension changed because of IE farb incompatibility
	    $(".Dialog1").height(260);
	  }
	  else{
	     $(".Dialog1").height(260);
	  }
	}
	else {
	   if(page.getBrowserName()=="msie"){
	     $(".Dialog1").height(340);
	   }
	   else{
	     $(".Dialog1").height(500);
	   }
	}
	openBorder = false;
      }
    );
    $("#changeFillCol").toggle(
      function () {
	$("#colory").show("slow");
	if(openBorder === false){
	  if(page.getBrowserName()=="msie"){
	     $(".Dialog1").height(340);
	  }
	  else{
	    $(".Dialog1").height(500);
	  }
	}
	else {
	  if(page.getBrowserName()=="msie"){
	    $(".Dialog1").height(370);
	  }
	  else{
	    $(".Dialog1").height(740);
	  }
	}
	openFill = true;
      },
      function() {
	$(".Dialog1").height(260);
	$("#colory").hide("slow");
	$.farbtastic("#color2").setColor(document.getElementById("color2").value);
	color.FillColor = $.farbtastic("#color2").color;
	document.getElementById("fillColorNow").style.backgroundColor = color.FillColor;
	toolbar.rebind(canvas,canvasObj,visual, color.BorderColor,color.FillColor);
	if(openBorder === false){
	  if(page.getBrowserName()=="msie"){
	    $(".Dialog1").height(260);
	  }
	  else{
	    $(".Dialog1").height(260);
	  }
	}
	else {
	  if(page.getBrowserName()=="msie"){
	    $(".Dialog1").height(310);
	  }
	  else{
	  $(".Dialog1").height(500);
	  }
	}
	openFill = false;
      }
    );
  }
  else{ //Opera workaround applied, graphics glitches
    $(".Dialog1").height(310);
    $(".farbtastic").hide();
    $("#picker1").hide();
    $("#picker2").hide();
    $("#picker1").css({"display":"none"});
    $("#picker2").css({"display":"none"});
    $("#colorx").css({"display":"block"});
    $("#colory").css({"display":"block"});
    //border
    $("#changeBorderCol").click(function(){
      $.farbtastic("#color1").setColor(document.getElementById("color1").value);
      color.BorderColor=$.farbtastic("#color1").color;
      document.getElementById("borderColorNow").style.backgroundColor = color.BorderColor;
      toolbar.rebind(canvas,canvasObj,visual,color.BorderColor,color.FillColor);
    });
    //fill
    $("#changeFillCol").unbind("click");
    $("#changeFillCol").click(function(){
      $(".farbtastic").hide();
      $("#picker1").hide();
      $("#picker2").hide();
      $.farbtastic("#color2").setColor(document.getElementById("color2").value);
      color.FillColor=$.farbtastic("#color2").color;
      document.getElementById("fillColorNow").style.backgroundColor = color.FillColor;
      toolbar.rebind(canvas,canvasObj,visual,color.BorderColor,color.FillColor);
    });
}



  // Save & Load Dialogs handlers
 $("#saveButton").click(function () {
   $("#saveDialog").dialog( 'close' ); //close the save dialog
 });


 //Load zone
 var doc;
 $("#loadButton").click(function () {
  doc = $("#my_iframe").contents().find('body').html();//alert(doc);
 });
 //Server/client communication for loading
 $('#MyForm').submit(function () {
   $('#my_iframe').bind('load', function () {
                          $("#loadDialog").dialog( 'close' );
                          doc = $("#my_iframe").contents().find('body').html();

                          if (doc.indexOf("Errore:")===0) {
                            // server error
                            alert(doc);
                          } else {
                            var  r = new SVGReader();
                            try {
                              var fs = r.read(doc);
                              visual.setFigureSet(fs);
                            }
                            catch (err) {
                              alert('Errore durante il caricamento: ' + err);
                            }
                            canvasObj.clear();
                            visual.refresh();
                            $('#my_iframe').unbind('load');
                          }
                        });
   });

 // Advanced functions disabled for older browsers
 if((page.getBrowserName()=="firefox" && page.getBrowserVersion()<3.1) ||
   page.getBrowserName()=="opera" || page.getBrowserName()=="msie" ||
   (page.getBrowserName()=="chrome" &&  page.getBrowserVersion()<2)||
   (page.getBrowserName()=="safari" &&  page.getBrowserVersion()<4)) {
     $("#fontTypeButton").css({"display":"none"});
 }

});
