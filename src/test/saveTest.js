$(document).ready(function () {
                    test("Save Test", function () {
                           var c = new Rectangle();
                           c.getBorderColour().set(255, 0, 0, new Opacity(1));
                           c.getBounds().setStart(new Point(10, 20));
                           c.getBounds().setEnd(new Point(50, 40));

                           var svgValue = "<rect x=\"10\" y=\"20\" width=\"40\" height=\"20\" fill=\"#000000\" stroke=\"#ff0000\"></rect>\n"

                           var s = new SVGGenerator(1000, 1000);
									s._doc = "";
                           c.toSVG(s);
                           equals(s._doc, svgValue, 'Rectangle');
                         });
                  });
