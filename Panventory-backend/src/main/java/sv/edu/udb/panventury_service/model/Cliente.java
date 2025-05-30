package sv.edu.udb.panventury_service.model;

import jakarta.persistence.*;

@Entity
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String correo;
    private String telefono;

    @ManyToOne
    @JoinColumn(name = "municipio_id")
    private Municipio municipio;
}