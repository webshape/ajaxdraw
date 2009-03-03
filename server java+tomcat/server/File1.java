package file1Pack;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

import fileNotFoundPack.FileNotFound;

public class File1 {
	File fileLoad;
	String fileSave;
	String text;
	public File1(){}
	public File1(File f) {
		fileLoad=f;
		fileSave=null;
		}
    public File1 (String n,String a){
    	fileSave=n;
    	text=a;
    }
    public String getFile() throws IOException {
    	String response="";    	    	
    	if (fileSave!=null) {
    		String path="C://Programmi/Apache Software Foundation/Tomcat 6.0/webapps/Server/";
    		File absolute=new File (path+fileSave);
    		if (absolute.exists()) {
    			FileWriter fw=new FileWriter(absolute,false);
    			fw.write(text);
    			fw.close();
    			return fileSave;
    		}
    		else
    		{
    			PrintWriter pw = new PrintWriter(path+fileSave);
                pw.println(text);
                pw.close();
                return fileSave;
    		}
    	}
    	else {
    			BufferedReader in=null;
	    try {
	    	in = new BufferedReader(new FileReader(fileLoad));
	    	} catch (FileNotFoundException e) {
	    		FileNotFound err=new FileNotFound();
	    	    return err.getFileNotFound();
	    	    }
	    while(true) {
	    	String s = in.readLine();
	    	if(s==null)
	    		break;
	    	else
	    		response=response+s;
	    	}
	    in.close();
	    return response;
	    }
    }
    public void deleteFile(File f){
    	f.delete();
    }
    }
