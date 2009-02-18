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



function changeFarbColor(col,type){
  $.farbtastic("#color").setColor(col);
  document.getElementById("color").value=$.farbtastic("#color").color;
  document.getElementById("coloreOra").style.backgroundColor=col;
  $.farbtastic("#color").updateDisplay();
}




function createColDialog(){
     $("#colorDialog").dialog({
    	position: ["right","top"],
    	height: 300,
    	width: 230,
    	dialogClass: "Dialog1"

    });

}

function createEdgeDialog(){
  $("#edgeNumberDialog").dialog({
   // position: ["right","top"],
    height: 100,
    width:320,
    dialogClass: "edgeDialog",
    buttons: { "Conferma": function() {
		 $(this).dialog("close");
		 $(this).click(function () {
		   polygonEdgeNumber=document.getElementById("#edgeNumber").value;
    });

    } }

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
   	   activateStylesheet('msie.css'),
   	   $("canvas").css({"margin-top":"-13em"});
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
/*Creazione dialog proprietà */
    $("#propertiesDialog").dialog({
    	position: "right",
    	width: 230
    });
/* Ruota dei colori **********************/
    $("#picker").farbtastic("#color");

    $("#changeCol").toggle(
       function () {
		$("#colorx").show("slow"),
        	    $(".Dialog1").height(500);
       },
       function() {
	$(".Dialog1").height(300),
     		$("#colorx").hide("slow");
       }
     // if($.browser.opera==false){
     //  $("canvas").css({'cursor' : 'url("../pages/images/selezione.gif")'});}
     );


	$(".toolbarButton").hover(
	  function(){
	    $(this).fadeOut(100);
	    $(this).fadeIn(500);
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

