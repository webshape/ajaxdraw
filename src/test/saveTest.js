function runSaveTest () {
  test("Save Test", function () {
	  var r = new Rectangle();
	  r.getBorderColour().set(255, 0, 0, new Opacity(1));
	  r.getBounds().setStart(new Point(10, 20));
	  r.getBounds().setEnd(new Point(50, 40));
	  var svgValue = "<rect x=\"10\" y=\"20\" width=\"40\" height=\"20\" fill=\"#000000\" fill-opacity=\"1\" stroke=\"#ff0000\" stroke-opacity=\"1\"></rect>\n";
	  var s = new SVGGenerator(1000, 1000);
	  s._doc = "";
	  r.toSVG(s);
	  equals(s._doc, svgValue, 'Rectangle');

	  var c = new Circle();
	  c = new Circle();
	  c.setSelection(true);
	  c.getBorderColour().set(125, 0, 255, new Opacity(1));
	  c.getBounds().setStart(new Point(450, 350));
	  c.getBounds().setEnd(new Point(550, 450));
	  svgValue = "<ellipse cx=\"500\" cy=\"400\" rx=\"50\" ry=\"50\" fill=\"#000000\" fill-opacity=\"1\" stroke=\"#7d00ff\" stroke-opacity=\"1\"></ellipse>\n";
	  s._doc = "";
	  c.toSVG(s);
	  equals(s._doc, svgValue, 'Circle');

	  var e = new Circle();
	  e.getBorderColour().set(255, 0, 255, new Opacity(1));
	  e.getFillColour().set(255, 0, 0, new Opacity(1));
	  e.getBounds().setStart(new Point(100, 200));
	  e.getBounds().setEnd(new Point(400, 300));
	  svgValue = "<ellipse cx=\"250\" cy=\"250\" rx=\"150\" ry=\"50\" fill=\"#ff0000\" fill-opacity=\"1\" stroke=\"#ff00ff\" stroke-opacity=\"1\"></ellipse>\n";
	  s._doc = "";
	  e.toSVG(s);
	  equals(s._doc, svgValue, 'Ellipse');

	  var p = new Polygon();
	  p.getBorderColour().set(255, 0, 0, new Opacity(1));
	  p.getBounds().setStart(new Point(10, 10));
	  p.getBounds().setEnd(new Point(50, 50));
	  svgValue = "<polygon fill=\"#000000\" fill-opacity=\"1\" stroke=\"#ff0000\" stroke-opacity=\"1\" points=\"50,30 20.000000000000004,47.32050807568878 19.999999999999993,12.679491924311233 \"></polygon>\n";
	  s = new SVGGenerator(1000, 1000);
	  s._doc = "";
	  p.toSVG(s);
	  equals(s._doc, svgValue, 'Polygon');

	  var l = new StraightLine();
	  l.getBorderColour().set(0, 0, 255, new Opacity(1));
	  l.getBounds().setStart(new Point(0, 500));
	  l.getBounds().setEnd(new Point(200, 600));
	  svgValue = "<line x1=\"0\" y1=\"500\" x2=\"200\" y2=\"600\" stroke=\"#0000ff\" stroke-opacity=\"1\"></line>\n";
	  s = new SVGGenerator(1000, 1000);
	  s._doc = "";
	  l.toSVG(s);
	  equals(s._doc, svgValue, 'StraightLine');

	  var f = new FreeLine();
	  f.getBorderColour().set(10, 20, 40, new Opacity(1));
	  f.getBounds().setStart(new Point(400, 500));
	  f.getBounds().setEnd(new Point(600, 700));
	  f.extend(new Point(400, 500));
	  f.extend(new Point(500, 600));
	  f.extend(new Point(520, 520));
	  f.extend(new Point(550, 550));
	  f.extend(new Point(600, 700));
	  svgValue = "<path fill=\"none\" stroke=\"#0a1428\" stroke-opacity=\"1\" d=\"M 400,500 C 500,600 520,520 550,550 L 600,700\"></path>\n";
	  s = new SVGGenerator(1000, 1000);
	  s._doc = "";
	  f.toSVG(s);
	  equals(s._doc, svgValue, 'FreeLine');

	  var b = new FreeLine();
	  b.getBorderColour().set(10, 20, 40, new Opacity(1));
	  b.getBounds().setStart(new Point(600, 500));
	  b.getBounds().setEnd(new Point(800, 700));
	  b.extend(new Point(600, 500));
	  b.extend(new Point(700, 600));
	  b.extend(new Point(720, 520));
	  b.extend(new Point(750, 550));
	  b.extend(new Point(780, 690));
	  b.extend(new Point(800, 700));
	  svgValue = "<path fill=\"none\" stroke=\"#0a1428\" stroke-opacity=\"1\" d=\"M 600,500 C 700,600 720,520 750,550 Q 780,690 800,700\"></path>\n";
	  s = new SVGGenerator(1000, 1000);
	  s._doc = "";
	  b.toSVG(s);
	  equals(s._doc, svgValue, 'BezierCurve');

	  // general
	  var fs = new FigureSet();
	  fs.add(r);
	  fs.add(c);
	  var w = new SVGWriter();
	  var svg = w.write(fs);
	  svgValue = "<?xml version=\"1.0\" standalone=\"no\"?>\n"
	  + "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n"
	  + "<svg width=\"1000\" height=\"1000\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n"
	  +  "<rect x=\"10\" y=\"20\" width=\"40\" height=\"20\" fill=\"#000000\" fill-opacity=\"1\" stroke=\"#ff0000\" stroke-opacity=\"1\"></rect>\n"
	  +  "<ellipse cx=\"500\" cy=\"400\" rx=\"50\" ry=\"50\" fill=\"#000000\" fill-opacity=\"1\" stroke=\"#7d00ff\" stroke-opacity=\"1\"></ellipse>\n"
	  +  "</svg>";
	  equals(svg, svgValue, 'Svg document');

     });
}