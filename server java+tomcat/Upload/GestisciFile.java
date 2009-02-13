package filePack;
import java.io.*;

import javax.servlet.http.HttpServletRequest;

import com.oreilly.servlet.MultipartRequest;

public class GestisciFile {
//File myfile;
//String mypath;
HttpServletRequest request;

public GestisciFile(HttpServletRequest request2) {
//	myfile=f;
//	mypath=p;
	request=request2;
}

public void getFile1() throws IOException {
	MultipartRequest multi = new MultipartRequest(request,"."); //per gestire le richieste
    File f = multi.getFile("my_file"); //mi salvo il file selezionato
    String filePath = multi.getOriginalFileName("my_file"); //mi salvo il path del file selezionato
    String path = "C:\\";//path di partenza per salvare sul server

    try {
        // ricavo i dati dal file
        FileInputStream in = new FileInputStream(f);
        // percorso dove andrà salvato il file
        FileOutputStream out = new FileOutputStream(path+f.getName());

        // salviamo il file nel percorso specificato
        while (in.available()>0) {
            out.write(in.read()); 
        }
        // chiusura degli stream
        in.close();
        out.close();
}
    catch (FileNotFoundException fnfe) {
        fnfe.printStackTrace();
    }
    catch (IOException ioe) {
        ioe.printStackTrace();
    }

}
}