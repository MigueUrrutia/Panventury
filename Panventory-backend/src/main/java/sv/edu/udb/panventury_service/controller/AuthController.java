package sv.edu.udb.panventury_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import sv.edu.udb.panventury_service.dto.LoginRequest;
import sv.edu.udb.panventury_service.dto.LoginResponse;
import sv.edu.udb.panventury_service.enums.RolEnum;
import sv.edu.udb.panventury_service.model.Usuario;
import sv.edu.udb.panventury_service.security.JwtTokenUtil;
import sv.edu.udb.panventury_service.service.UsuarioService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getPassword())
            );

            final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            final String token = jwtTokenUtil.generateToken(userDetails);

            Usuario usuario = usuarioService.buscarPorCorreo(request.getCorreo()).orElseThrow();

            return ResponseEntity.ok(new LoginResponse(
                "Login exitoso",
                true,
                usuario.getId(),
                usuario.getNombre(),
                usuario.getRol().toString(),
                token
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new LoginResponse(
                "Credenciales inválidas",
                false
            ));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        try {
            // Por defecto, los nuevos registros son usuarios normales
            if (usuario.getRol() == null) {
                usuario.setRol(RolEnum.USUARIO);
            }
            
            // Encriptar la contraseña
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
            
            Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
            
            return ResponseEntity.ok(new LoginResponse(
                "Usuario registrado exitosamente",
                true,
                nuevoUsuario.getId(),
                nuevoUsuario.getNombre(),
                nuevoUsuario.getRol().toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new LoginResponse(
                "Error al registrar usuario: " + e.getMessage(),
                false
            ));
        }
    }
}