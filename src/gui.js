$(document).ready(function(){
    
    $("#example").dialog({
    position: ["right","top"],
    height: 300,
    dialogClass: "Dialog1"
    });
    
    $("#example2").dialog({
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
     $("#selezione").click(function () {
		if(sentSelect==false){     
       	$(this).css({"background-color":"#A0A0A0"}),
       	sentSelect=true;
       	}
		else {
			$(this).css({"background-color":"#F4F3F2"}),
			sentSelect=false;     
       }
      });
		
		 $("#quadrato").tooltip();
		 
     
     
  });
