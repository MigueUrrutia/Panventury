package sv.edu.udb.panventury_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import sv.edu.udb.panventury_service.model.Orden;
import sv.edu.udb.panventury_service.model.OrdenDetalle;
import sv.edu.udb.panventury_service.service.OrdenService;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    @Autowired
    private OrdenService ordenService;

    @PostMapping
    public Orden crearOrden(@RequestBody OrdenConDetalles request) {
        return ordenService.crearOrden(request.orden, request.detalles);
    }

    public static class OrdenConDetalles {
        public Orden orden;
        public List<OrdenDetalle> detalles;
    }
}