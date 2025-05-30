package sv.edu.udb.panventury_service.model;

import jakarta.persistence.*;
import sv.edu.udb.panventury_service.enums.EstadoOrdenEnum;
import java.time.LocalDateTime;

@Entity
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    private LocalDateTime fecha;

    @Enumerated(EnumType.STRING)
    private EstadoOrdenEnum estado = EstadoOrdenEnum.EN_ESPERA;

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public EstadoOrdenEnum getEstado() {
        return estado;
    }

    public void setEstado(EstadoOrdenEnum estado) {
        this.estado = estado;
    }
}