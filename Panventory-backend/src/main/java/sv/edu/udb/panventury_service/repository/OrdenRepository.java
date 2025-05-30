package sv.edu.udb.panventury_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.udb.panventury_service.model.Orden;

import java.util.List;

public interface OrdenRepository extends JpaRepository<Orden, Long> {
    List<Orden> findByClienteId(Long clienteId);
}
