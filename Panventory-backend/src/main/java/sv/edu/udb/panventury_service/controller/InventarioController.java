package sv.edu.udb.panventury_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
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
    public Inventario guardar(@RequestBody Inventario inventario) {
        return inventarioService.guardar(inventario);
    }

    @GetMapping("/producto/{id}")
    public Optional<Inventario> obtenerPorProducto(@PathVariable Long id) {
        return inventarioService.buscarPorProductoId(id);
    }

    // 🔹 Nuevo endpoint para listar todo el inventario
    @GetMapping
    public List<Inventario> obtenerTodo() {
        return inventarioService.obtenerInventario();
    }
}
