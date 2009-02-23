package serverErrorPack;

import communicationErrorPack.CommunicationError;

public class ServerError extends Exception implements CommunicationError {

	private static final long serialVersionUID = 1L;

	public String getError() {
		return "Errore del server!";
	}

}
