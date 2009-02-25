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
	File target;
	String name_file;
	String area;
	public File1(File f) {
		target=f;
		name_file=null;
		}
    public File1 (String n,String a){
    	name_file=n;
    	area=a;
    }
    public String getFile() throws IOException {
    	String resp="";    	    	
    	if (name_file!=null) {
    		String path="C://";
    		File file=new File (path+name_file);
    		if (file.exists()) {
    			FileWriter fw=new FileWriter(file,true);
    			fw.write(area);
    			fw.close();
    			return "Salvato in"+" "+path+name_file;
    		}
    		else
    		{
    			PrintWriter pw = new PrintWriter(path+name_file);
                pw.println(area);
                pw.close();
                return "Salvato nel nuovo file"+" "+path+name_file;
    		}
    	}
    	else {
    			BufferedReader in=null;
	    try {
	    	in = new BufferedReader(new FileReader(target));
	    	} catch (FileNotFoundException e) {
	    		FileNotFound err=new FileNotFound();
	    	    return err.getFileNotFound();
	    	    }
	    while(true) {
	    	String s = in.readLine();
	    	if(s==null)
	    		break;
	    	else
	    		resp=resp+s;
	    	}
	    in.close();
	    return resp;
	    }
    }
    }
