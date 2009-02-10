$(document).ready(function () {
                    test("BoundingRectangle", function () {
                           var r = new BoundingRectangle(new Point(-10, -10),
                                                         new Point(10, 10));
                           same(r.centre(), new Point(10, 10), 'centre');
                           equals(r.h(), 20, 'h');
                           equals(r.w(), 20, 'w');
                           same(r.start(), new Point(-10, -10), 'start');
                           same(r.end(), new Point(10, 10), 'end');
                           r.setStart(new Point(20, 20));
                           same(r.start(), new Point(20, 20), 'setStart');
                           equals(r.h(), -10, 'negative h');
                           equals(r.w(), -10, 'negative w');
                           r.setEnd(new Point(5, 6));
                           same(r.end(), new Point(5, 6), 'setEnd');
                         });
                  });
