package sv.edu.udb.panventury_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.udb.panventury_service.model.Factura;
import sv.edu.udb.panventury_service.model.Orden;

import java.util.Optional;

public interface FacturaRepository extends JpaRepository<Factura, Long> {
    Optional<Factura> findByOrden(Orden orden);
}