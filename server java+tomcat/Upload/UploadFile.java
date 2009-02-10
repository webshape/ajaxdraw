package uploadPack;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import com.oreilly.servlet.*;// permette l'uso di MultiPartRequest

public class UploadFile extends HttpServlet {

private static final long serialVersionUID = 1L;

public void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{

//	ServletContext context = getServletContext(); // per ricavare il MIME del file
    String url = null;
    try {
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

       url = "upload.jsp";

//         inserisco i dati nella request per poi inviarli alla pagina jsp 
//        request.setAttribute("contentType",context.getMimeType(f.getName()));
        request.setAttribute("path",f.getName());

        RequestDispatcher rd =request.getRequestDispatcher(url);
          rd.forward(request,response);
          }catch(Exception e) {e.printStackTrace();}
        }
}