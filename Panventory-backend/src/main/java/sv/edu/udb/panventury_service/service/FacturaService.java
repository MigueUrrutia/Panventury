package sv.edu.udb.panventury_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sv.edu.udb.panventury_service.model.Factura;
import sv.edu.udb.panventury_service.model.Orden;
import sv.edu.udb.panventury_service.repository.FacturaRepository;
import sv.edu.udb.panventury_service.repository.OrdenRepository;

import java.util.List;
import java.util.Optional;

@Service
public class FacturaService {

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private OrdenRepository ordenRepository;

    public List<Factura> obtenerTodasLasFacturas() {
        return facturaRepository.findAll();
    }

    public Optional<Factura> obtenerFacturaPorId(Long id) {
        return facturaRepository.findById(id);
    }

    public Optional<Factura> obtenerFacturaPorOrdenId(Long ordenId) {
        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        return facturaRepository.findByOrden(orden);
    }
} 