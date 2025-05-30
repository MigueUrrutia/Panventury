package sv.edu.udb.panventury_service.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import sv.edu.udb.panventury_service.model.Inventario;
import sv.edu.udb.panventury_service.repository.InventarioRepository;

@Service
public class InventarioService {

    @Autowired
    private InventarioRepository inventarioRepository;

    public Inventario guardar(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }

    public Optional<Inventario> buscarPorProductoId(Long productoId) {
        return inventarioRepository.findByProductoId(productoId);
    }

    public void ajustarStock(Long productoId, int cantidad) {
        Inventario inv = inventarioRepository.findByProductoId(productoId)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado"));

        inv.setCantidad(inv.getCantidad() + cantidad);
        inventarioRepository.save(inv);
    }

    public List<Inventario> obtenerInventario() {
        return inventarioRepository.findAll();
    }
}
