package serverPack.test;

import junit.framework.*;
import serverPack.*;
import java.io.File;
import java.io.IOException;

import cleanPack.Clean;
import serverErrorPack.ServerError;
import file1Pack.File1;


public class ServerTest extends TestCase{
	 String file;
	 public ServerTest(){
		  file = "<?xml version=\"1.0\" standalone=\"no\"?>";
		  file += "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">";
		  file += "<svg width=\"1000\" height=\"1000\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">";
		  file += "<rect x=\"0\" y=\"250\" width=\"200\" height=\"50\" fill=\"#00ff00\" fill-opacity=\"0.8\" stroke=\"#000000\" stroke-opacity=\"1\"></rect></svg>";
	 }

	 public void testLoad() throws IOException{
		 Server srv1 = new Server(new File("serverPack/test/file.svg"));
		 assertEquals(file, srv1.getLoad());
   }
	 public void testSave() throws IOException{
		  Server srv1 = new Server("serverPack/test/file1.svg", file);
		  File1 f = new File1(new File(srv1.getSave()));
		  assertEquals(file, f.getFile());
	}
}
