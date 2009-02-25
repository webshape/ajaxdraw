package serverPack;

import java.io.File;
import java.io.IOException;
import serverErrorPack.ServerError;
import file1Pack.File1;

public class Server {
	File target;
	String text;
	String name;
	public Server(File file) {
		target=file;
		}
	public Server(String f,String t) {
		name=f;
		text=t;
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
		try {
			File1 f=new File1(name,text);
			return f.getFile();
		} catch (Exception e) {
			ServerError err=new ServerError();
			return err.getError();
		}
		
	}
//		File GetHTML() {}


}
