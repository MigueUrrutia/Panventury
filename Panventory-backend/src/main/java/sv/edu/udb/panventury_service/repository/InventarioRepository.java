package sv.edu.udb.panventury_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.udb.panventury_service.model.Inventario;

import java.util.Optional;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {
    Optional<Inventario> findByProductoId(Long productoId);
}