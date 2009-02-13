package uploadPack;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import com.oreilly.servlet.*;// permette l'uso di MultiPartRequest

import filePack.GestisciFile;

public class UploadFile extends HttpServlet {

private static final long serialVersionUID = 1L;

public void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{

//	ServletContext context = getServletContext(); // per ricavare il MIME del file
    String url = null;
    try {
    	GestisciFile gf=new GestisciFile(request);
    	gf.getFile1();


       url = "upload.jsp";

//         inserisco i dati nella request per poi inviarli alla pagina jsp 
//        request.setAttribute("contentType",context.getMimeType(f.getName()));
//        request.setAttribute("path",f.getName());

        RequestDispatcher rd =request.getRequestDispatcher(url);
          rd.forward(request,response);
          }catch(Exception e) {e.printStackTrace();}
        }
}
