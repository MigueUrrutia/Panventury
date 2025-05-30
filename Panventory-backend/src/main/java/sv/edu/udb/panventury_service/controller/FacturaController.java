package sv.edu.udb.panventury_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import sv.edu.udb.panventury_service.model.Factura;
import sv.edu.udb.panventury_service.service.FacturaService;

import java.util.List;

@RestController
@RequestMapping("/api/facturas")
public class FacturaController {

    @Autowired
    private FacturaService facturaService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PANADERO')")
    public List<Factura> obtenerTodasLasFacturas() {
        return facturaService.obtenerTodasLasFacturas();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PANADERO', 'USUARIO')")
    public ResponseEntity<Factura> obtenerFacturaPorId(@PathVariable Long id) {
        return facturaService.obtenerFacturaPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/orden/{ordenId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PANADERO', 'USUARIO')")
    public ResponseEntity<Factura> obtenerFacturaPorOrdenId(@PathVariable Long ordenId) {
        return facturaService.obtenerFacturaPorOrdenId(ordenId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 