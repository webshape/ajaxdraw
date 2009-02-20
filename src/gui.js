/*Funzione che gestisce il cambio di foglio CSS per browser*/
function activateStylesheet(sheetref){
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
}


var BorderColor="#000000";
var FillColor="#000000";



/**
 * Change figure color by clicking on the palette's preffered color
 * @param {String} string with hex color representation
 * @return  null
 */
function changeFarbColor(col){
  if( document.getElementById("comboColor").value=="border"){
  $.farbtastic("#color1").setColor(col);
  document.getElementById("color1").value=$.farbtastic("#color1").color;
  document.getElementById("borderColorNow").style.backgroundColor=col;
  BorderColor=col;
}
  else{
 $.farbtastic("#color2").setColor(col);
  document.getElementById("color2").value=$.farbtastic("#color2").color;
  document.getElementById("fillColorNow").style.backgroundColor=col;
  FillColor=col;
  }
}



function createColDialog(){
     $("#colorDialog").dialog({
    	position: ["right","top"],
    	height: 210,
    	width: 230,
    	dialogClass: "Dialog1"

    });

}

function edgeNumberSetter(value){
  polygonEdgeNumber=value;
}



function createEdgeDialog(){
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



}



/*parte di jQuery */
$(document).ready(function(){
/* carica fogli di stile diversi a seconda del browser */
  if ($.browser.name=="safari") {
   	   activateStylesheet('safari.css');
  }
     else if ($.browser.name=="chrome") {
   	   activateStylesheet('chrome.css');
     }
     else if ($.browser.name=="msie") {
       activateStylesheet('msie.css');
   	//   $("canvas").css({"margin-top":"-13em"});
     }
     else if ($.browser.name=="opera") {
   	   activateStylesheet('opera.css');
     }
     else if ($.browser.name=="konqueror") {
   	   activateStylesheet('konqueror.css');
     }


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
       createColDialog();
/* Creazione dialog Edge */
       createEdgeDialog();

       $("#edgeNumberDialog").dialog("close");

       $("#edgeSetter").click(function () {
	 edgeNumberSetter( parseInt(document.getElementById("edgeNumber").value,10));
	 $("#edgeNumberDialog").dialog("close");

       });
/*Creazione dialog proprietà */
    $("#propertiesDialog").dialog({
    	position: "right",
    	width: 230
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
	BorderColor=$.farbtastic("#color1").color;
	document.getElementById("borderColorNow").style.backgroundColor=BorderColor;
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
	 FillColor=$.farbtastic("#color2").color;
	 document.getElementById("fillColorNow").style.backgroundColor=FillColor;
       }
     );


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
     // if($.browser.opera==false){
     //  $("canvas").css({'cursor' : 'url("../pages/images/selezione.gif")'});}
     );

/*Animazione tooltip su pulsante toolbar ritardata di 1 secondo*/
       $(".toolbarButton").tooltip(
	 {delay: 1000}
       );




//fine documento
  });

