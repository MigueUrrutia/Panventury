package sv.edu.udb.panventury_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import sv.edu.udb.panventury_service.dto.LoginRequest;
import sv.edu.udb.panventury_service.dto.LoginResponse;
import sv.edu.udb.panventury_service.model.Usuario;
import sv.edu.udb.panventury_service.service.UsuarioService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest input) {
        Usuario usuario = usuarioService.buscarPorCorreo(input.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (input.getPassword().equals(usuario.getPassword())) {
            return new LoginResponse("Login exitoso", true);
        } else {
            return new LoginResponse("Contraseña incorrecta", false);
        }
    }

    @PostMapping("/register")
    public LoginResponse register(@RequestBody Usuario usuario) {
        usuarioService.registrarUsuario(usuario);
        return new LoginResponse("Usuario registrado", true);
    }
}