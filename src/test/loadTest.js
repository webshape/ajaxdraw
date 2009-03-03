function runLoadTest () {
  test("Load Test", function () {
			var doc = "<svg width=\"1000\" height=\"1000\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">";

			// rectangle
			doc += "<rect x=\"0\" y=\"250\" width=\"200\" height=\"50\" fill=\"#00ff00\" fill-opacity=\"0.8\" stroke=\"#000000\" stroke-opacity=\"1\"></rect>\n</svg>";
			var s = new SVGReader();
			var fs = new Array();
			fs = s.read(doc);
			var r = fs._figures[0];
			equals(r.getBounds().start().x, "0", 'Rectangle: starting x');
			equals(r.getBounds().start().y, "250", 'Rectangle: starting y');
			equals(r.getBounds().end().x, "200", 'Rectangle: ending x');
			equals(r.getBounds().end().y, "300", 'Rectangle: ending y');
			equals(r.getFillColour().toCSS(), "#00ff00", 'Rectangle: fill colour');
			equals(r.getFillColour().getOpacity().getVal(), "0.8", 'Rectangle: fill opacity');
			equals(r.getBorderColour().toCSS(), "#000000", 'Rectangle: border colour');
			equals(r.getBroderColour().getOpacity().getVal(), "1", 'Rectangle: border opacity');
       });
}