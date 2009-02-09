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

/*parte di jquery */
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

	/*Creazione dialog colore */
    $("#colorDialog").dialog({
    	position: ["right","top"],
    	height: 300,
    	width: 230,
    	dialogClass: "Dialog1"
    });
	/*Creazione dialog proprietà */
    $("#propertiesDialog").dialog({
    	position: "right",
    	width: 230
    });
 /* Ruota dei colori **********************/
    $("#picker").farbtastic("#color");

    $("#changeCol").click(function () {
     		$("#colorx").show("slow"),
        	    $(".Dialog1").height(500);
      });
 /* ********************************************/
 /*Animazione chiusura ruota */
    $("#closeWheel").click(function () {
    		$(".Dialog1").height(300),
     		$("#colorx").hide("slow");

     	});

     /* Funzione gestione pulsante toolbar premuto/rilasciato*/
     $(".toolbarButton").toggle(
       function () {
	 $(this).css({"background-color":"#A0A0A0"});
       },
       function() {
	 $(this).css({"background-color":"#F4F3F2"});
       }
     // if($.browser.opera==false){
     //  $("canvas").css({'cursor' : 'url("../pages/images/selezione.gif")'});}
     );

       /*Animazione tooltip su pulsante toolbar*/
       $(".toolbarButton").tooltip(
	 {delay: 1000}
       );


       $(".toolbarButton").click(function() {
	 $(this).effect("highlight");
       });








//fine documento
  });
