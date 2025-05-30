package sv.edu.udb.panventury_service.model;

import jakarta.persistence.*;

@Entity
public class Departamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;

    @ManyToOne
    @JoinColumn(name = "pais_id")
    private Pais pais;
}
