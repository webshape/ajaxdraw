package cleanPack;

import java.io.File;
import java.io.FilenameFilter;

//import javax.swing.filechooser.FileFilter;

//import com.sun.net.httpserver.Filter;

import file1Pack.File1;

public class Clean {
	public void sweeper(){

		String path="C://Programmi/Apache Software Foundation/Tomcat 6.0/webapps/Server/";
        File1 del=new File1();		
		FileExtFilter filter = new FileExtFilter(".txt");
		File dir = new File(path); 

		String[] list = dir.list(filter); 
		File file; 
		if (list.length == 0) return; 
		for (int i = 0; i < list.length; i++) { 
			file = new File(path+list[i]); 
			del.deleteFile(file); 
			}				
	}

}
class FileExtFilter implements FilenameFilter
{
	private String estenzione; 
	public FileExtFilter( String estenzione ) { 
	this.estenzione = estenzione; 
	} 
	public boolean accept(File dir, String name) { 
	return (name.endsWith(estenzione)); 
	} 
}

