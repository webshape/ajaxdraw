function runGuiTest() {


  test("Page",function(){
    var p = new Page();
    var name = p.getBrowserName();
    same(p.getBrowserName(),$.browser.name,'getBrowserName()');
    same(p.getBrowserVersion(),$.browser.version,'getVersionName()');


       });


  test("Canvas & Visualization",function(){
	 var c = new Canvas();
	 var f = new FigureSet();
	 var v = new Visualization(f);
	 same(c.getId(),document.getElementById("cv"),'getId()');
	 same(c.getHeight(),document.getElementById("cv").getAttribute("height"),"getHeight()");
	 same(c.getWidth(),document.getElementById("cv").getAttribute("width"),"getWidth()");
	 same(v.getFigureSet(),f,"getFigureSet()");
       });
}