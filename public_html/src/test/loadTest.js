/**
 * Copyright (C) 2009 WebShape
 * Use, modification and distribution is subject to the GPL license
 */

function runLoadTest () {
  test("Load Test", function () {

            var s = new SVGReader();
	    var fs = [];

			// rectangle
            var doc = "<svg width=\"1000\" height=\"1000\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">";
	    doc += "<rect x=\"0\" y=\"250\" width=\"200\" height=\"50\" fill=\"#00ff00\" fill-opacity=\"0.8\" stroke=\"#000000\" stroke-opacity=\"1\"></rect>\n</svg>";
	    fs = s.read(doc);
	    var r = fs._figures[0];
	    equals(r.getBounds().start().x, "0", 'Rectangle: starting x');
	    equals(r.getBounds().start().y, "250", 'Rectangle: starting y');
	    equals(r.getBounds().end().x, "200", 'Rectangle: ending x');
	    equals(r.getBounds().end().y, "300", 'Rectangle: ending y');
	    equals(r.getFillColour().toCSS(), "#00ff00", 'Rectangle: fill colour');
	    equals(r.getFillColour().getOpacity().getVal(), "0.8", 'Rectangle: fill opacity');
	    equals(r.getBorderColour().toCSS(), "#000000", 'Rectangle: border colour');
	    equals(r.getBorderColour().getOpacity().getVal(), "1", 'Rectangle: border opacity');

            //cirlce
            doc = "<svg width=\"1000\" height=\"1000\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">";
	    doc += "<ellipse cx=\"500\" cy=\"400\" rx=\"50\" ry=\"50\" fill=\"#000000\" fill-opacity=\"1\" stroke=\"#7d00ff\" stroke-opacity=\"1\"></ellipse>\n</svg>";
	    fs = s.read(doc);
	    var c = fs._figures[0];
	    equals(c.getBounds().start().x, "450", 'Circle: starting x');
	    equals(c.getBounds().start().y, "350", 'Circle: starting y');
	    equals(c.getBounds().end().x, "550", 'Circle: ending x');
	    equals(c.getBounds().end().y, "450", 'Circle: ending y');
	    equals(c.getFillColour().toCSS(), "#000000", 'Circle: fill colour');
	    equals(c.getFillColour().getOpacity().getVal(), "1", 'Circle: fill opacity');
	    equals(c.getBorderColour().toCSS(), "#7d00ff", 'Circle: border colour');
	    equals(c.getBorderColour().getOpacity().getVal(), "1", 'Circle: border opacity');

	    //ellipse
            doc = "<svg width=\"1000\" height=\"1000\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">";
	    doc += "<ellipse cx=\"250\" cy=\"250\" rx=\"150\" ry=\"50\" fill=\"#ff0000\" fill-opacity=\"1\" stroke=\"#ff00ff\" stroke-opacity=\"1\"></ellipse>\n</svg>";
	    fs = s.read(doc);
	    var e = fs._figures[0];
	    equals(e.getBounds().start().x, "100", 'Ellipse: starting x');
	    equals(e.getBounds().start().y, "200", 'Ellipse: starting y');
	    equals(e.getBounds().end().x, "400", 'Ellipse: ending x');
	    equals(e.getBounds().end().y, "300", 'Ellipse: ending y');
	    equals(e.getFillColour().toCSS(), "#ff0000", 'Ellipse: fill colour');
	    equals(e.getFillColour().getOpacity().getVal(), "1", 'Ellipse: fill opacity');
	    equals(e.getBorderColour().toCSS(), "#ff00ff", 'Ellipse: border colour');
	    equals(e.getBorderColour().getOpacity().getVal(), "1", 'Ellipse: border opacity');

	    //polygon
            doc = "<svg width=\"1000\" height=\"1000\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">";
		 doc += "<polygon fill=\"#000000\" fill-opacity=\"1\" stroke=\"#ff0000\" stroke-opacity=\"1\" points=\"50,30 20,47 20,13 \"></polygon>\n</svg>";
	    fs = s.read(doc);
	    var p = fs._figures[0];
	    equals(p.getBounds().start().x, "20", 'Polygon: starting x');
	    equals(p.getBounds().start().y, "13", 'Polygon: starting y');
	    equals(p.getBounds().end().x, "50", 'Polygon: ending x');
	    equals(p.getBounds().end().y, "47", 'Polygon: ending y');
	    equals(p.edgeNumber().getVal(),"3",'Polygon: edges');
	    equals(p.getFillColour().toCSS(), "#000000", 'Polygon: fill colour');
	    equals(p.getFillColour().getOpacity().getVal(), "1", 'Polygon: fill opacity');
	    equals(p.getBorderColour().toCSS(), "#ff0000", 'Polygon: border colour');
	    equals(p.getBorderColour().getOpacity().getVal(), "1", 'Polygon: border opacity');

	    //straightline
            doc = "<svg width=\"1000\" height=\"1000\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">";
	    doc += "<line x1=\"0\" y1=\"500\" x2=\"200\" y2=\"600\" stroke=\"#0000ff\" stroke-opacity=\"1\"></line>\n</svg>";
	    fs = s.read(doc);
	    var l = fs._figures[0];
	    equals(l.getBounds().start().x, "0", 'StraightLine: starting x');
	    equals(l.getBounds().start().y, "500", 'StraightLine: starting y');
	    equals(l.getBounds().end().x, "200", 'StraightLine: ending x');
	    equals(l.getBounds().end().y, "600", 'StraightLine: ending y');
	    equals(l.getBorderColour().toCSS(), "#0000ff", 'StraightLine: border colour');
	    equals(l.getBorderColour().getOpacity().getVal(), "1", 'StraightLine: border opacity');

            //freeline
            doc = "<svg width=\"1000\" height=\"1000\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">";
	    doc += "<path fill=\"none\" stroke=\"#0a1428\" stroke-opacity=\"1\" d=\"M 400,500 C 400,500 500,600 520,520 Q 550,550 600,700\"></path>\n</svg>";
	    fs = s.read(doc);
	    var f = fs._figures[0];
	    /*equals(f.getBounds().start().x, "400", 'FreeLine: starting x');
	      equals(f.getBounds().start().y, "500", 'FreeLine: starting y');
	      equals(f.getBounds().end().x, "600", 'FreeLine: ending x');
	      equals(f.getBounds().end().y, "700", 'FreeLine: ending y');*/
            var points = f.getPoints();
            equals(points[0].x, "400", 'FreeLine: point1 x');
            equals(points[0].y, "500", 'FreeLine: point1 y');
            equals(points[1].x, "400", 'FreeLine: point2 x');
            equals(points[1].y, "500", 'FreeLine: point2 y');
            equals(points[2].x, "500", 'FreeLine: point3 x');
            equals(points[2].y, "600", 'FreeLine: point3 y');
            equals(points[3].x, "520", 'FreeLine: point4 x');
            equals(points[3].y, "520", 'FreeLine: point4 y');
            equals(points[4].x, "550", 'FreeLine: point5 x');
            equals(points[4].y, "550", 'FreeLine: point5 y');
            equals(points[5].x, "600", 'FreeLine: point6 x');
            equals(points[5].y, "700", 'FreeLine: point6 y');
	    equals(f.getBorderColour().toCSS(), "#0a1428", 'FreeLine: border colour');
	    equals(f.getBorderColour().getOpacity().getVal(), "1", 'FreeLine: border opacity');


            //beziercurve
            doc = "<svg width=\"1000\" height=\"1000\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">";
	    doc += "<path fill=\"none\" stroke=\"#0a1428\" stroke-opacity=\"1\" d=\"M 600,500 C 600,500 700,600 720,520 C 750,550 780,690 800,700\"></path>\n</svg>";
	    fs = s.read(doc);
	    var b = fs._figures[0];
            var pointsb = b.getPoints();
            equals(pointsb[0].x, "600", 'BezierCurve: point1 x');
            equals(pointsb[0].y, "500", 'BezierCurve: point1 y');
            equals(pointsb[1].x, "600", 'BezierCurve: point2 x');
            equals(pointsb[1].y, "500", 'BezierCurve: point2 y');
            equals(pointsb[2].x, "700", 'BezierCurve: point3 x');
            equals(pointsb[2].y, "600", 'BezierCurve: point3 y');
            equals(pointsb[3].x, "720", 'BezierCurve: point4 x');
            equals(pointsb[3].y, "520", 'BezierCurve: point4 y');
            equals(pointsb[4].x, "750", 'BezierCurve: point5 x');
            equals(pointsb[4].y, "550", 'BezierCurve: point5 y');
            equals(pointsb[5].x, "780", 'BezierCurve: point6 x');
            equals(pointsb[5].y, "690", 'BezierCurve: point6 y');
            equals(pointsb[6].x, "800", 'BezierCurve: point7 x');
            equals(pointsb[6].y, "700", 'BezierCurve: point7 y');
	    equals(b.getBorderColour().toCSS(), "#0a1428", 'BezierCurve: border colour');
	    equals(b.getBorderColour().getOpacity().getVal(), "1", 'BezierCurve: border opacity');
       });
}