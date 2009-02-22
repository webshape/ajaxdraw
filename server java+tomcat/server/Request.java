package requestPack;

import javax.servlet.*;
import javax.servlet.http.*;

import serverPack.Server;

import java.io.*;
import com.oreilly.servlet.*;

import connessionErrorPack.ConnessionError;

public class Request extends HttpServlet {

	private static final long serialVersionUID = 1L;

public void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{

    String testo="";
	try {
        MultipartRequest multi = new MultipartRequest(request,"."); 
        File f = multi.getFile("my_file"); 
        Server s=new Server(f);
        testo=s.getSave();

	    }
        catch (Exception e) {
            ConnessionError err=new ConnessionError();
            testo=err.getError();
        }
        String url = "server.jsp";
        request.setAttribute("prova", testo);
        RequestDispatcher rd =request.getRequestDispatcher(url);
        rd.forward(request,response);
        
        }
        }