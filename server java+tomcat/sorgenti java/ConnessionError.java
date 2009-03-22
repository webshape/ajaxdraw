package connessionErrorPack;

import communicationErrorPack.CommunicationError;

public class ConnessionError extends Exception implements CommunicationError {
	private static final long serialVersionUID = 1L;
	public String getError() {
		return "Errore: errore di connessione!";
		}
	}

