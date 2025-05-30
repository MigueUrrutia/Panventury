package sv.edu.udb.panventury_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import sv.edu.udb.panventury_service.model.Orden;
import sv.edu.udb.panventury_service.model.OrdenDetalle;
import sv.edu.udb.panventury_service.model.Usuario;
import sv.edu.udb.panventury_service.service.OrdenService;
import sv.edu.udb.panventury_service.service.UsuarioService;
import sv.edu.udb.panventury_service.enums.EstadoOrdenEnum;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    @Autowired
    private OrdenService ordenService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    @PreAuthorize("hasRole('USUARIO')")
    public Orden crearOrden(@RequestBody OrdenConDetalles request) {
        return ordenService.crearOrden(request.orden, request.detalles);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('PANADERO', 'ADMIN')")
    public List<Orden> listarOrdenes() {
        return ordenService.obtenerTodasLasOrdenes();
    }

    @GetMapping("/mis-ordenes")
    @PreAuthorize("hasRole('USUARIO')")
    public List<Orden> obtenerMisOrdenes() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = usuarioService.buscarPorCorreo(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ordenService.obtenerOrdenesPorUsuario(usuario.getId());
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('PANADERO', 'ADMIN')")
    public Orden actualizarEstado(@PathVariable Long id, @RequestBody CambioEstadoRequest request) {
        return ordenService.actualizarEstadoOrden(id, request.getEstado());
    }

    public static class OrdenConDetalles {
        public Orden orden;
        public List<OrdenDetalle> detalles;
    }

    public static class CambioEstadoRequest {
        private EstadoOrdenEnum estado;

        public EstadoOrdenEnum getEstado() {
            return estado;
        }

        public void setEstado(EstadoOrdenEnum estado) {
            this.estado = estado;
        }
    }
}