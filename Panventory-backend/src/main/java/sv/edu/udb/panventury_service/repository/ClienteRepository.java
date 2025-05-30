package sv.edu.udb.panventury_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.edu.udb.panventury_service.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}