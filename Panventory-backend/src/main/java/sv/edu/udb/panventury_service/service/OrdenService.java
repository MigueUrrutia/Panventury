package sv.edu.udb.panventury_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.edu.udb.panventury_service.model.*;
import sv.edu.udb.panventury_service.repository.*;
import sv.edu.udb.panventury_service.enums.EstadoOrdenEnum;

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
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private InventarioService inventarioService;

    @Transactional
    public Orden crearOrden(Orden orden, List<OrdenDetalle> detalles) {
        // Obtener el usuario autenticado
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Usuario usuario = usuarioRepository.findByCorreo(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Buscar o crear el cliente correspondiente al usuario
        Cliente cliente = clienteRepository.findByCorreo(usuario.getCorreo())
                .orElseGet(() -> {
                    Cliente nuevoCliente = new Cliente();
                    nuevoCliente.setNombre(usuario.getNombre());
                    nuevoCliente.setCorreo(usuario.getCorreo());
                    nuevoCliente.setMunicipio(usuario.getMunicipio());
                    return clienteRepository.save(nuevoCliente);
                });
        
        orden.setCliente(cliente);
        orden.setFecha(LocalDateTime.now());
        orden.setEstado(EstadoOrdenEnum.EN_ESPERA);
        Orden nueva = ordenRepository.save(orden);

        BigDecimal total = BigDecimal.ZERO;

        for (OrdenDetalle detalle : detalles) {
            // Validar que el producto existe
            Producto producto = productoRepository.findById(detalle.getProducto().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + detalle.getProducto().getId()));
            
            // Validar inventario
            inventarioService.buscarPorProductoId(producto.getId())
                    .filter(inv -> inv.getCantidad() >= detalle.getCantidad())
                    .orElseThrow(() -> new RuntimeException("No hay suficiente inventario para el producto: " + producto.getId()));

            detalle.setOrden(nueva);
            detalle.setProducto(producto);
            detalle.setPrecioUnitario(producto.getPrecio());
            ordenDetalleRepository.save(detalle);
            
            // Actualizar inventario
            inventarioService.ajustarStock(producto.getId(), -detalle.getCantidad());

            total = total.add(producto.getPrecio().multiply(BigDecimal.valueOf(detalle.getCantidad())));
        }

        Factura factura = new Factura();
        factura.setOrden(nueva);
        factura.setFechaEmision(LocalDateTime.now());
        factura.setTotal(total);
        facturaRepository.save(factura);

        return nueva;
    }

    public List<Orden> obtenerOrdenesPorUsuario(Long usuarioId) {
        // Buscar el cliente correspondiente al usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Cliente cliente = clienteRepository.findByCorreo(usuario.getCorreo())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return ordenRepository.findByClienteId(cliente.getId());
    }

    public List<Orden> obtenerTodasLasOrdenes() {
        return ordenRepository.findAll();
    }

    @Transactional
    public Orden actualizarEstadoOrden(Long ordenId, EstadoOrdenEnum nuevoEstado) {
        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada con ID: " + ordenId));
        orden.setEstado(nuevoEstado);
        return ordenRepository.save(orden);
    }
}