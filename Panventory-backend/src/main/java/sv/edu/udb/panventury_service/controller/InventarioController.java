package sv.edu.udb.panventury_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import sv.edu.udb.panventury_service.model.Inventario;
import sv.edu.udb.panventury_service.service.InventarioService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;

    @PostMapping
    @PreAuthorize("hasAnyRole('PANADERO', 'ADMIN')")
    public Inventario guardar(@RequestBody Inventario inventario) {
        return inventarioService.guardar(inventario);
    }

    @GetMapping("/producto/{id}")
    @PreAuthorize("hasAnyRole('PANADERO', 'ADMIN')")
    public Optional<Inventario> obtenerPorProducto(@PathVariable Long id) {
        return inventarioService.buscarPorProductoId(id);
    }

    // 🔹 Nuevo endpoint para listar todo el inventario
    @GetMapping
    @PreAuthorize("hasAnyRole('PANADERO', 'ADMIN')")
    public List<Inventario> obtenerTodo() {
        return inventarioService.obtenerInventario();
    }

    @PutMapping("/ajustar/{productoId}")
    @PreAuthorize("hasAnyRole('PANADERO', 'ADMIN')")
    public void ajustarInventario(@PathVariable Long productoId, @RequestBody AjusteInventario ajuste) {
        inventarioService.ajustarStock(productoId, ajuste.getCantidad());
    }

    public static class AjusteInventario {
        private int cantidad;

        public int getCantidad() {
            return cantidad;
        }

        public void setCantidad(int cantidad) {
            this.cantidad = cantidad;
        }
    }
}
