package formPackage;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.RequestDispatcher;
import info.File_testo;


 public class Form extends javax.servlet.http.HttpServlet implements javax.servlet.Servlet {
   static final long serialVersionUID = 1L;
   

	public Form() {
		super();
	}   	
	

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String t = request.getParameter("testo");
		File_testo f=new File_testo();
		f.addItem(t, "./webapps/Esempio_Server/WEB-INF/output/risultato.txt");
		
		RequestDispatcher dispatcher;
	    dispatcher = getServletContext().getRequestDispatcher(
	          "/Form.jsp");
	    dispatcher.forward(request,response);
	}  	
	

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	}   	  	    
}