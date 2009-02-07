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


$(document).ready(function(){
	/* carica fogli di stile diversi a seconda del browser */
	var version = jQuery.browser.version;
	if ($.browser.safari) {
   	   activateStylesheet('safari.css');
   	   if (version=="525.27.1"){  	   
	   	   $(".toolbarButton").css({"width":"3.5em"}),
	   	   $(".toolbarButton").css({"height":"2.5em"});
	   	}
	}

	if ($.browser.opera) {
   	   activateStylesheet('opera.css');
	}
   if ($.browser.msie) {
   	   activateStylesheet('msie.css'),
   	   $("canvas").css({"margin-top":"-13em"});
	}


    $("#colorDialog").dialog({
    	position: ["right","top"],
    	height: 300,
    	dialogClass: "Dialog1"
    });

    $("#propertiesDialog").dialog({
    	position: ["right","bottom"]}
    	);

    $("#picker").farbtastic("#color");

    $("#changeCol").click(function () {
     		$("#colorx").show("slow"),
         $(".Dialog1").height(500)
      });

    $("#closeWheel").click(function () {
    		$(".Dialog1").height(300),
     		$("#colorx").hide("slow");

     	});

     /* Funzione gestione pulsante toolbar premuto/rilasciato*/
     sentSelect=false;
     $("#selectionButton").click(function () {
		if(sentSelect==false){
       	$(this).css({"background-color":"#A0A0A0"}),
       	sentSelect=true;
       	}
		else {
			$(this).css({"background-color":"#F4F3F2"}),
			sentSelect=false;
       }
       $("canvas").css({'cursor' : 'url("../pages/images/selezione.gif")'});
      });

		 $(".toolbarButton").tooltip(
		 {delay: 1000}
);



  });
