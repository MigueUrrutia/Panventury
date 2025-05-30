package sv.edu.udb.panventury_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sv.edu.udb.panventury_service.model.*;
import sv.edu.udb.panventury_service.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrdenService {

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private OrdenDetalleRepository ordenDetalleRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private InventarioService inventarioService;

    public Orden crearOrden(Orden orden, List<OrdenDetalle> detalles) {
        orden.setFecha(LocalDateTime.now());
        Orden nueva = ordenRepository.save(orden);

        BigDecimal total = BigDecimal.ZERO;

        for (OrdenDetalle detalle : detalles) {
            detalle.setOrden(nueva);
            Producto prod = productoRepository.findById(detalle.getProducto().getId()).orElseThrow();
            detalle.setPrecioUnitario(prod.getPrecio());
            ordenDetalleRepository.save(detalle);
            inventarioService.ajustarStock(prod.getId(), -detalle.getCantidad());

            total = total.add(prod.getPrecio().multiply(BigDecimal.valueOf(detalle.getCantidad())));
        }

        Factura factura = new Factura();
        factura.setOrden(nueva);
        factura.setFechaEmision(LocalDateTime.now());
        factura.setTotal(total);
        facturaRepository.save(factura);

        return nueva;
    }
}