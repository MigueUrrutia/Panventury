package sv.edu.udb.panventury_service.dto;

public class LoginResponse {
    private String mensaje;
    private boolean autenticado;

    public LoginResponse(String mensaje, boolean autenticado) {
        this.mensaje = mensaje;
        this.autenticado = autenticado;
    }

    public String getMensaje() {
        return mensaje;
    }

    public boolean isAutenticado() {
        return autenticado;
    }
}