package sv.edu.udb.panventury_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sv.edu.udb.panventury_service.model.Usuario;
import sv.edu.udb.panventury_service.repository.UsuarioRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;


    public Usuario registrarUsuario(Usuario usuario) {
        // usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setPassword(usuario.getPassword()); // texto plano
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }
}
