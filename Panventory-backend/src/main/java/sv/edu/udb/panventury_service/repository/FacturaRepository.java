package sv.edu.udb.panventury_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.udb.panventury_service.model.Factura;

public interface FacturaRepository extends JpaRepository<Factura, Long> {
}