package serverPack;

import java.io.File;
import java.io.IOException;

import cleanPack.Clean;
import serverErrorPack.ServerError;
import file1Pack.File1;

public class Server {
	File target;
	String content;
	String nameFile;
	public Server(File file) {
		target=file;
		}
	public Server(String f,String t) {
		nameFile=f;
		content=t;
	}
	public String getLoad() throws IOException {
		try {
			File1 gf=null;
		    gf=new File1(target);
	        return gf.getFile();
	        } catch (Exception e) {
	        	ServerError err=new ServerError();
			    return err.getError();
			    }
	        }

	public String getSave() throws IOException {
		Clean cl=new Clean();
		cl.sweeper();
		try {
			File1 f=new File1(nameFile,content);
			return f.getFile();
		} catch (Exception e) {
			ServerError err=new ServerError();
			return err.getError();
		}
		
	}
//		File GetHTML() {}


}
