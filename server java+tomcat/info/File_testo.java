package info;

import java.io.*;

public class File_testo {
	public synchronized static void addItem(String s, String file)
    throws IOException
{
  PrintWriter out = new PrintWriter(new FileWriter(file, true));

  out.println(s);
  out.close(); 
}

}
