package sv.edu.udb.panventury_service.dto;

public class LoginResponse {
    private String mensaje;
    private boolean autenticado;
    private Long userId;
    private String nombre;
    private String rol;
    private String token;

    public LoginResponse(String mensaje, boolean autenticado) {
        this.mensaje = mensaje;
        this.autenticado = autenticado;
    }

    public LoginResponse(String mensaje, boolean autenticado, Long userId, String nombre, String rol) {
        this.mensaje = mensaje;
        this.autenticado = autenticado;
        this.userId = userId;
        this.nombre = nombre;
        this.rol = rol;
    }

    public LoginResponse(String mensaje, boolean autenticado, Long userId, String nombre, String rol, String token) {
        this.mensaje = mensaje;
        this.autenticado = autenticado;
        this.userId = userId;
        this.nombre = nombre;
        this.rol = rol;
        this.token = token;
    }

    public String getMensaje() {
        return mensaje;
    }

    public boolean isAutenticado() {
        return autenticado;
    }

    public Long getUserId() {
        return userId;
    }

    public String getNombre() {
        return nombre;
    }

    public String getRol() {
        return rol;
    }

    public String getToken() {
        return token;
    }
}