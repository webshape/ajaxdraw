/**
 * Copyright (C) 2009 WebShape
 * Use, modification and distribution is subject to the GPL license
 */

function runGuiTest() {

  test("Page",function(){
    var p = new Page();
    var name = p.getBrowserName();
    same(p.getBrowserName(),$.browser.name,'getBrowserName()');
    same(p.getBrowserVersion(),$.browser.versionNumber,'getBrowserVersion()');


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