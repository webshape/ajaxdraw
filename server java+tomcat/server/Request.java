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
		String resp="";
		String edit="";
		String text="";
		try {
			MultipartRequest multi = new MultipartRequest(request,".");
			if (multi.getParameter("name_file")==null) //se esiste il parametro
			{
             	File f = multi.getFile("my_file");
				Server s=new Server(f);
	            resp=s.getLoad();
	        }
			else
			{
				edit=multi.getParameter("name_file");
				text=multi.getParameter("area");
				Server s2=new Server(edit,text);
				resp=s2.getSave();
			}
            } catch (Exception e) {
            	ConnessionError err=new ConnessionError();
                resp=err.getError();
                }
        String url = "server.jsp";
        request.setAttribute("result", resp);
        RequestDispatcher rd =request.getRequestDispatcher(url);
        rd.forward(request,response);
        }
	}
