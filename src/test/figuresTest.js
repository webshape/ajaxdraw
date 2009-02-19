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
       ok(r.createWidget() instanceof BoundingRectangleSetter, 'createWidget');
     });

test('Colour & Opacity', function () {
       var o = new Opacity(0.5);
       var c = new Colour(0, 255, 2, o);
       equals(o.getVal(), 0.5, 'getVal');
       o.setVal(0.9);
       equals(o.getVal(), 0.9, 'setVal');
       equals(c.toCSS(), '#00ff02', 'toCSS');
       c.set(254, 0, 0, o);
       equals(c.toCSS(), '#fe0000', 'set');
       equals(c._o, o, 'set');
       c.fromCSS('#01aBf6');
       equals(c.toCSS(), '#01abf6', 'fromCSS');
       var e = false;
       try {
         c.fromCSS('#01abg6');
       } catch (ex) {
         e = true;
       }
       ok(e, 'illegal CSS value');
       e = false;
       try {
         c.fromCSS('#01abf67');
       } catch (ex) {
         e = true;
       }
       ok(e, 'illegal CSS value (2)');
       ok(c.createWidget() instanceof ColourDialog, 'createWidget');
     });

test('EdgeNumber', function () {
       var e = new EdgeNumber(7);
       equals(e.getVal(), 7, 'getVal');
       e.setVal(9);
       equals(e.getVal(), 9, 'setVal');
       ok(e.createWidget() instanceof EdgeNumberSetter, 'createWidget');
     });

test('TextFont', function () {
       var t = new TextFont('verdana');
       equals(t.toCSS(), 'verdana', 'toCSS');
     });

test('FigureSet', function () {
       var fs = new FigureSet();
       var f1 = new Circle();
       var f2 = new Rectangle();
       var f3 = new Polygon();
       var count = function () {
         var i = 0;
         fs.each(function (f) {
                   i++;
                 });
         return i;
       };
       fs.add(f1);
       equals(count(), 1, 'add & each (1)');
       fs.add(f2);
       equals(count(), 2, 'add & each (2)');
       fs.add(f3);
       equals(count(), 3, 'add & each (3)');
       fs.rem(f2);
       equals(count(), 2, 'rem');
       fs.rem(f2);
       equals(count(), 2, 'rem non existant');
       fs.add(f2);
       var i = 0;
       var res = false;
       fs.each(function (f) {
                 if (i == 2) {
                   res = f instanceof Rectangle;
                 }
                 i++;
               });
       ok(res, 'last added, last position');
     });
  
test('FigureSet.selectFigure', function () {
       var fs = new FigureSet();
       var f = new StraightLine();
       f.getBounds().setStart(new Point(0, 0));
       f.getBounds().setEnd(new Point(100, 100));
       fs.add(f);
       equals(fs.selectFigure(new Point(10, 10)), f, 'line selection in');
       equals(fs.selectFigure(new Point(99, 99)), f, 'line selection in');
       equals(fs.selectFigure(new Point(10, 19)), null, 'line selection out');
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
       // add a lot of figures
       var last = null;
       for (var i = 0; i < 300; i++) {
         var c = new Circle();
         c.getBounds().setStart(new Point(300, 300));
         c.getBounds().setEnd(new Point(400, 350));
         fs.add(c);
         last = c;
       }
       equals(fs.selectFigure(new Point(350, 325)), last, 
              'lot of figures in same postion, last selected');
     });

test('Figure', function () {
       var f = new Rectangle(); // a concrete figure
       equals(f.isSelected(), false, 'isSelected');
       f.setSelection(true);
       equals(f.isSelected(), true, 'setSelection');
       same(f.getBounds(), new BoundingRectangle(new Point(0, 0), 
                                                 new Point(0,0)),
            'getBounds()');
       equals(f.getBorderColour().toCSS(), '#000000', 'getBorderColour');
     });
  
test('Circle', function () {
       var c = new Circle();
       c.getFillColour().set(1, 2, 3, new Opacity(1));
       equals(c.getFillColour().toCSS(), '#010203', 'getFillColour');
     });

test('Polygon', function () {
       var p = new Polygon();
       p.getFillColour().set(1, 2, 3, new Opacity(1));
       equals(p.getFillColour().toCSS(), '#010203', 'getFillColour');
       ok(p.edgeNumber() instanceof EdgeNumber, 'edgeNumber');
       p.getBounds().setStart(new Point(10, 20));
       p.getBounds().setEnd(new Point(110, 120));
       p.edgeNumber().setVal(4);
       same(p.getPoints().map(function (p) { 
                                return new Point(Math.round(p.x),
                                                 Math.round(p.y));
                              }),
            [new Point(100, 50), new Point(50, 100),
             new Point(0, 50), new Point(50, 0)],
            'getPoints (4 edges)');
//       p.getEdgeNumber().setVal(3);
  //     same(p.getPoints(), [new Point(100, 50), new Point(50, 0),
       //                     new Point(0, 50), new Point(50, 100)],
    //        'getPoints (3 edges)');       
     });

test('Rectangle', function () {
       var r = new Rectangle();
       r.getFillColour().set(1, 2, 3, new Opacity(1));
       equals(r.getFillColour().toCSS(), '#010203', 'getFillColour');
     });

// nothing to test here for StraightLine
  
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
       f = new FreeLine();
       pts = [new Point(60, 60), new Point(30, 60), new Point(0, 0)];
       pts.each(function (p) {
                  f.extend(p);
                });
       // reverse the bounds
       var start = f.getBounds().start();
       f.getBounds().setStart(f.getBounds().end());
       f.getBounds().setEnd(start);
       f.extend(new Point(70, 65));
       f.extend(new Point(-1, -1));
       pts = [new Point(0, 0), new Point(30, 0), new Point(60, 60),
              new Point(70, 65), new Point(-1 , -1)];
       same(f.getPoints(), pts, 'correct abs/rel conversion, reversed');
       same(f.getBounds(), new BoundingRectangle(new Point(70, 65), 
                                                 new Point(-1, -1)),
            'bounds adjusted, reversed');
       f = new FreeLine();
       f.extend(new Point(0, 0));
       f.extend(new Point(0, 56));
       same(f.getPoints(), [new Point(0, 0), new Point(0, 56)], 
            'extend with width 0');
       same(f.getBounds(), new BoundingRectangle(new Point(0, 0), 
                                                 new Point(0, 56)),
            'extend with width 0 (bounds)');
     });

test('Text', function () {
       var t = new Text('aloha!');
       t.getTextColour().set(1, 2, 3, new Opacity(1));
       equals(t.getTextColour().toCSS(), '#010203', 'getTextColour');
       equals(t.getText(), 'aloha!', 'getText');
       t.setText('new');
       equals(t.getText(), 'new', 'setText');
       equals(t.getFont().toCSS(), 'sans-serif', 'getFont');
       t.setFont(new TextFont('verdana'));
       equals(t.getFont().toCSS(), 'verdana', 'setFont');
     });

// drawing functions tested in draw.html
  
}
