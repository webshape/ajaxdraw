package serverPack;

import java.io.File;
import java.io.IOException;

import serverErrorPack.ServerError;

import file1Pack.File1;

public class Server {
		File target;
		public Server(File file) {
			target=file;
		}
		
	public String getSave() throws IOException {
		try {
		    File1 gf=null;
		    gf=new File1(target);
	        return gf.getFile();
		} catch (Exception e) {
			ServerError err=new ServerError();
			return err.getError();
		}
	}

//		File getLoad() {}
//		File GetHTML() {}


}
