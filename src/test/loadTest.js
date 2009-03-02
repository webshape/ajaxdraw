function runLoadTest () {
  test("Load Test", function () {
        var r = new Rectangle();
        r.startCommand("rect");
        r.attr("x", 10, false);
        r.attr("y", 20, false);
        r.attr("width", 40, false);
        r.attr("height", 20, false);
        r.attr("fill", "#000000", false);
        r.attr("fill-opacity", 1, false);
        r.attr("stroke", "#ff0000", false);
        r.attr("stroke-opacity", "1", true);
        r.endCommand("rect");
        var figureValue = "r.getBorderColour().set(255, 0, 0, new Opacity(1));\n" + "r.getBounds().setStart(new Point(10, 20));\n" + "r.getBounds().setEnd(new Point(50, 40));\n";
        var s = new SVGReader(1000, 1000);
		s._doc = "";
        r.fromSVG(s);
        equals(s._doc, figureValue, 'Rectangle');
       });
}}