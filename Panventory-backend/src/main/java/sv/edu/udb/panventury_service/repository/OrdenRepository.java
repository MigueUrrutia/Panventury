package sv.edu.udb.panventury_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.udb.panventury_service.model.Orden;

public interface OrdenRepository extends JpaRepository<Orden, Long> {
}
