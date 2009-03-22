package cleanPack;

import java.io.File;
import java.io.FilenameFilter;
import java.util.Date;
import java.util.GregorianCalendar;

import file1Pack.File1;

public class Clean {
	public void sweeper(){
		GregorianCalendar c=new GregorianCalendar() ;
		String path="C://Programmi/Apache Software Foundation/Tomcat 6.0/webapps/AJAXDRAW/";
		File1 del=new File1();		
		MyFilter filter=new MyFilter(".svg");
		File dir=new File(path); 
		String[] list=dir.list(filter); 
		File file; 
		if (list.length==0) return;
		for (int i=0;i<list.length;i++) { 
			file=new File(path+list[i]);
			Date data=new Date(file.lastModified());
			int minuti=data.getMinutes();
			minuti=minuti+15;
			if (minuti>=60) {
				int ora=data.getHours();
				ora++;
				data.setHours(ora);
				minuti=minuti-60;
			}
			data.setMinutes(minuti);
            
		if (c.getTime().compareTo(data)>0){
				del.deleteFile(file);
			} 
			}				
	}

}
class MyFilter implements FilenameFilter {
	private String ext; 
	public MyFilter(String ext) { 
		this.ext=ext; 
	} 
	public boolean accept(File dir,String name) { 
	return (name.endsWith(ext)); 
	} 
}

