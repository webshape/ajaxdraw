package file1Pack;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import fileNotFoundPack.FileNotFound;

public class File1 {
	File myfile;
  public File1(File f) {
	  myfile=f;
  }
  public String getFile() throws IOException {
	    String testo="";
	    BufferedReader in=null;
	    try {
	    in = new BufferedReader(new FileReader(myfile));
	    } catch (FileNotFoundException e) {
	    	FileNotFound err=new FileNotFound();
	    	return err.getFileNotFound();
	    }
            while(true) {
	    	String s = in.readLine();
	    	if(s==null)
	    	break;
	    	else
	    	testo=testo+s;
	    	}
	    	in.close();

      return testo;
		
	}
	
}
