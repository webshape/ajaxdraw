function runFiguresTest() {
                    
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
                    
test('FigureSet.selectFigure', function () {
       var fs = new FigureSet();
       var f = new StraightLine();
       f.getBounds().setStart(new Point(0, 0));
       f.getBounds().setEnd(new Point(100, 100));
       fs.add(f);
       equals(fs.selectFigure(new Point(10, 10)), f, 'line selection in');
       equals(fs.selectFigure(new Point(99, 99)), f, 'line selection in');
       equals(fs.selectFigure(new Point(10, 12)), null, 'line selection out');
       equals(fs.selectFigure(new Point(102, 102)), null, 
              'line selection out');
       var p = new Polygon();
       p.getBounds().setStart(new Point(0, 0));
       p.getBounds().setEnd(new Point(200, 200));
       p.edgeNumber().setVal(7);
       fs.add(p);
       equals(fs.selectFigure(new Point(101, 101)), p, 
              'line with polygon over, point on polygon');
       equals(fs.selectFigure(new Point(100, 100)), p, 
              'line with polygon over');
       equals(fs.selectFigure(new Point(202, 200)), null, 
              'line with polygon over, point out of both');
       var t = new Text('#############');
       t.getBounds().setStart(new Point(0, 0));
       t.getBounds().setEnd(new Point(50, 50));
       fs.add(t);
       equals(fs.selectFigure(new Point(100, 100)), p, 
              'text and line with polygon over, point on polygon');
       //equals(fs.selectFigure(new Point(10, 10)), t,
         //     'text, line, polygon, point on text');
     });
                    
test('FreeLine', function () {
       var f = new FreeLine();
       var pts = [new Point(5, 5), new Point(5, 5), new Point(0, 10), 
                  new Point(100, 200), new Point(-23, 24), new Point(10, 10)];
       pts.each(function (p) {
                  f.extend(p);
                });
       // extend may change the original array
       pts = [new Point(5, 5), new Point(5, 5), new Point(0, 10), 
              new Point(100, 200), new Point(-23, 24), new Point(10, 10)];
       same(f.getPoints(), pts, 'correct abs/rel conversion');
       same(f.getBounds(), new BoundingRectangle(new Point(-23, 5), 
                                                 new Point(100, 200)),
            'bounds adjusted');
     });
                    
}
