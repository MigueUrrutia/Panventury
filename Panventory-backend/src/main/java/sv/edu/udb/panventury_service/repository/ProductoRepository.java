package sv.edu.udb.panventury_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.udb.panventury_service.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}