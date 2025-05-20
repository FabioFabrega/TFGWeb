'use client';
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { FaEuroSign, FaSearch, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import NavbarComponent from "@/componentes/Navbar";
import Carrusel from "@/componentes/Carrusel";
import Loading from "@/componentes/Loading";
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from "next/link";
import "../../globals.css";

// Función para obtener productos
async function getProductos() {
  try {
    const res = await fetch("http://143.47.56.237:3000/productos");
    if (!res.ok) {
      throw new Error("Failed to fetch productos");
    }
    return res.json();
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return null;
  }
}

// Función para eliminar producto del carrito
async function eliminarProductoDeCarrito(idCarrito, idProducto) {
  try {
    const res = await fetch(`http://143.47.56.237:3000/carritos/${idCarrito}/productos/${idProducto}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    throw error;
  }
}

// Función para añadir producto al carrito
async function añadirProductoACarrito(idCarrito, idProducto, cantidad) {
  try {
    const res = await fetch(`http://143.47.56.237:3000/carritos/${idCarrito}/productos/${idProducto}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cantidad }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error al añadir producto al carrito:", error);
    throw error;
  }
}

// Componente de producto
const Producto = ({ producto, onVerDetalle }) => (
  <Card className="h-100 shadow-sm producto-card">
    <div className="producto-imagen-container">
      <Card.Img 
        variant="top" 
        src={producto?.imagen || "/placeholder.jpg"} 
        alt={producto?.nombre} 
        className="producto-imagen"
      />
    </div>
    <Card.Body className="d-flex flex-column">
      <Card.Title className="producto-nombre">{producto?.nombre}</Card.Title>
      <Card.Text className="producto-descripcion flex-grow-1">{producto?.descripcion}</Card.Text>
      <div className="d-flex justify-content-between align-items-center mt-auto">
        <span className="producto-precio">{producto?.precio} <FaEuroSign /></span>
        <Button 
          variant="primary" 
          onClick={() => onVerDetalle(producto)}
          className="detalle-btn"
        >
          Ver detalles
        </Button>
      </div>
    </Card.Body>
  </Card>
);

// Componente de detalle de producto
const ProductoDetalle = ({ producto, añadirACarrito, onCerrarDetalle }) => {
  const [cantidad, setCantidad] = useState(1);

  const handleCantidadChange = (event) => {
    const nuevaCantidad = Math.min(Math.max(1, event.target.value), producto.stock);  
    setCantidad(nuevaCantidad);
  };

  const incrementarCantidad = () => {
    if (cantidad < producto.stock) {
      setCantidad(cantidad + 1);
    }
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  return (
    <Modal show={true} onHide={onCerrarDetalle} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <img 
              src={producto?.imagen || "/placeholder.jpg"} 
              alt={producto?.nombre} 
              className="img-fluid rounded"
              style={{ maxHeight: '300px', objectFit: 'contain', width: '100%' }}
            />
          </Col>
          <Col md={6}>
            <h3>{producto?.nombre}</h3>
            <p className="text-muted">{producto?.descripcion}</p>
            <h4 className="d-flex align-items-center mb-3">
              Precio: {producto?.precio} <FaEuroSign className="ms-1" />
            </h4>
            <p>Stock disponible: {producto?.stock}</p>
            <div className="d-flex align-items-center mb-3">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={decrementarCantidad}
                disabled={cantidad <= 1}
              >
                <FaMinus />
              </Button>
              <Form.Control
                type="number"
                min="1"
                max={producto?.stock}
                value={cantidad}
                onChange={handleCantidadChange}
                className="mx-2 text-center"
                style={{ width: '60px' }}
              />
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={incrementarCantidad}
                disabled={cantidad >= producto?.stock}
              >
                <FaPlus />
              </Button>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCerrarDetalle}>
          Cerrar
        </Button>
        <Button 
          variant="primary" 
          onClick={() => {
            añadirACarrito(producto, cantidad);
            onCerrarDetalle();
          }}
        >
          Añadir al carrito
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Componente de carrito
const CarritoModal = ({ show, onHide, carrito, eliminarDeCarrito, actualizarCantidad, usuarioAutenticado, idCarrito }) => {
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [mensajeError, setMensajeError] = useState(null);
  const [metodoPago, setMetodoPago] = useState('');
  const [showPagoModal, setShowPagoModal] = useState(false);
  
  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2);
  };

  const abrirModalPago = () => {
    if (!usuarioAutenticado || !idCarrito) {
      setMensajeError("No se puede procesar el pago: información de usuario o carrito no disponible");
      return;
    }
    
    setMetodoPago('');
    setMensajeError(null);
    setShowPagoModal(true);
  };

  const cerrarModalPago = () => {
    setShowPagoModal(false);
  };

  const procesarPago = async () => {
    if (!metodoPago) {
      setMensajeError("Por favor, seleccione un método de pago");
      return;
    }

    setProcesandoPago(true);
    setMensajeError(null);
    
    try {
      // Calcular el total del pedido
      const total = calcularTotal();
      
      // Crear el pedido con el total calculado
      const pedidoResponse = await fetch(`http://143.47.56.237:3000/pedidos/${usuarioAutenticado.id_usuario}/carritos/${idCarrito}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metodo_pago: metodoPago,
          total: parseFloat(total)
        }),
      });
      
      if (!pedidoResponse.ok) {
        throw new Error("Error al crear el pedido");
      }
      
      // Limpiar el carrito en la API
      await fetch(`http://143.47.56.237:3000/carritos/${idCarrito}/productos`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Mostrar mensaje de éxito y cerrar los modales
      alert("¡Pedido realizado con éxito!");
      cerrarModalPago();
      onHide();
      
      // Limpiar el carrito en el estado local
      carrito.length = 0;
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      setMensajeError(error.message);
    } finally {
      setProcesandoPago(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Mi Carrito</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {carrito.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((item) => (
                    <tr key={item.id_producto}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.imagen || "/placeholder.jpg"} 
                            alt={item.nombre} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                          />
                          <span>{item.nombre}</span>
                        </div>
                      </td>
                      <td>{item.precio} €</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => actualizarCantidad(item.id_producto, Math.max(1, item.cantidad - 1))}
                            disabled={item.cantidad <= 1}
                          >
                            <FaMinus />
                          </Button>
                          <span className="mx-2">{item.cantidad}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => actualizarCantidad(item.id_producto, item.cantidad + 1)}
                            disabled={item.cantidad >= item.stock}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                      </td>
                      <td>{(item.precio * item.cantidad).toFixed(2)} €</td>
                      <td>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => eliminarDeCarrito(item.id_producto)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <h4>Total: {calcularTotal()} €</h4>
            </div>
            
            {mensajeError && (
              <div className="alert alert-danger mt-3">
                {mensajeError}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5">
            <p className="lead">No hay productos en el carrito</p>
            <Button variant="primary" onClick={onHide}>Continuar comprando</Button>
          </div>
        )}
      </Modal.Body>
      {carrito.length > 0 && (
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Seguir comprando
          </Button>
          <Button 
            variant="success" 
            onClick={abrirModalPago}
            disabled={!usuarioAutenticado || !idCarrito}
          >
            Proceder al pago
          </Button>
        </Modal.Footer>
      )}

      {/* Modal de selección de método de pago */}
      <Modal 
        show={showPagoModal} 
        onHide={cerrarModalPago}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Seleccione método de pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Total a pagar: {calcularTotal()} €</Form.Label>
              
              <div className="mt-3">
                <Form.Check
                  type="radio"
                  id="paypal"
                  name="metodoPago"
                  label="PayPal"
                  value="paypal"
                  checked={metodoPago === 'paypal'}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  id="visa"
                  name="metodoPago"
                  label="Visa"
                  value="visa"
                  checked={metodoPago === 'visa'}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  id="mastercard"
                  name="metodoPago"
                  label="MasterCard"
                  value="mastercard"
                  checked={metodoPago === 'mastercard'}
                  onChange={(e) => setMetodoPago(e.target.value)}
                />
              </div>
            </Form.Group>
            
            {metodoPago === 'visa' || metodoPago === 'mastercard' ? (
              <div className="mt-3">
                <Form.Group className="mb-3">
                  <Form.Label>Número de tarjeta</Form.Label>
                  <Form.Control type="text" placeholder="XXXX XXXX XXXX XXXX" />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de expiración</Form.Label>
                      <Form.Control type="text" placeholder="MM/AA" />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control type="text" placeholder="XXX" />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre en la tarjeta</Form.Label>
                  <Form.Control type="text" placeholder="Nombre completo" />
                </Form.Group>
              </div>
            ) : metodoPago === 'paypal' ? (
              <div className="mt-3 text-center">
                <p>Será redirigido a PayPal para completar el pago.</p>
                <img 
                  src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" 
                  alt="PayPal" 
                  style={{ height: '50px' }}
                />
              </div>
            ) : null}
            
            {mensajeError && (
              <div className="alert alert-danger mt-3">
                {mensajeError}
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModalPago}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={procesarPago}
            disabled={procesandoPago || !metodoPago}
          >
            {procesandoPago ? 'Procesando...' : 'Confirmar pago'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Modal>
  );
};

export default function UsuarioPage() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [showCarrito, setShowCarrito] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  // Estado para almacenar la información del usuario autenticado
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [idCarrito, setIdCarrito] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener todos los usuarios para simular autenticación
        const usuariosResponse = await fetch('http://143.47.56.237:3000/usuarios');
        if (!usuariosResponse.ok) {
          throw new Error('Error al obtener usuarios');
        }
        
        const usuarios = await usuariosResponse.json();
        
        // Simular usuario autenticado (en una aplicación real, esto vendría de la autenticación)
        // Usamos el primer usuario disponible para demostración
        if (usuarios && usuarios.length > 0) {
          const usuario = usuarios[0]; // Usar el primer usuario como ejemplo
          setUsuarioAutenticado(usuario);
          
          try {
            // Verificar si el usuario tiene un carrito
            if (!usuario.carrito) {
              console.log("Usuario sin carrito, intentando crear uno nuevo...");
              try {
                // Si el usuario no tiene un carrito, crear uno nuevo
                const nuevoCarritoResponse = await fetch(`http://143.47.56.237:3000/carritos`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ 
                    id_usuario: usuario.id_usuario,
                    fecha_creacion: new Date().toISOString(),
                    estado: 'activo'
                  }),
                });
                
                if (!nuevoCarritoResponse.ok) {
                  console.error("Error en la respuesta al crear carrito:", await nuevoCarritoResponse.text());
                  // En lugar de lanzar un error, simplemente continuamos sin carrito
                  console.warn("No se pudo crear un carrito nuevo, continuando sin carrito");
                  setError("No se pudo crear un carrito. Algunas funciones pueden estar limitadas.");
                } else {
                  const nuevoCarritoData = await nuevoCarritoResponse.json();
                  console.log("Carrito creado exitosamente:", nuevoCarritoData);
                  setIdCarrito(nuevoCarritoData.id_carrito);
                }
              } catch (carritoError) {
                console.error("Error al crear carrito:", carritoError);
                // En lugar de lanzar un error, simplemente continuamos sin carrito
                console.warn("Error al crear un carrito nuevo, continuando sin carrito");
                setError("No se pudo crear un carrito. Algunas funciones pueden estar limitadas.");
              }
            } else {
              // Si el usuario ya tiene un carrito, usar ese
              console.log("Usuario con carrito existente:", usuario.carrito.id_carrito);
              setIdCarrito(usuario.carrito.id_carrito);
            
              // Obtener los productos del carrito
              const carritoResponse = await fetch(`http://143.47.56.237:3000/carritos/${usuario.carrito.id_carrito}`);
              if (carritoResponse.ok) {
                const carritoData = await carritoResponse.json();
                
                // Convertir los productos del carrito al formato que espera nuestro componente
                if (carritoData.carritoProductos && Array.isArray(carritoData.carritoProductos)) {
                  const productosCarrito = carritoData.carritoProductos.map(item => ({
                    id_producto: item.producto.id_producto,
                    nombre: item.producto.nombre,
                    descripcion: item.producto.descripcion,
                    precio: parseFloat(item.producto.precio),
                    imagen: item.producto.imagen,
                    stock: item.producto.stock,
                    cantidad: item.cantidad
                  }));
                  
                  setCarrito(productosCarrito);
                }
              }
            }
          } catch (error) {
            console.error("Error al verificar o crear carrito:", error);
            setError("Error al verificar o crear carrito: " + error.message);
          }
        }
        
        // Obtener todos los productos disponibles
        const productosData = await getProductos();
        if (productosData) {
          setProductos(productosData);
        } else {
          setError("No se pudieron cargar los productos");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError("Error al cargar datos: " + error.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Función para añadir al carrito
  const añadirACarrito = async (producto, cantidad) => {
    try {
      if (!idCarrito) {
        throw new Error("No se ha encontrado un carrito para el usuario");
      }
      
      // Llamar a la API para añadir el producto al carrito
      await añadirProductoACarrito(idCarrito, producto.id_producto, cantidad);
      
      // Actualizar el estado local del carrito
      const productoExistente = carrito.find(item => item.id_producto === producto.id_producto);
      
      if (productoExistente) {
        // Si el producto ya está en el carrito, actualizar la cantidad
        setCarrito(carrito.map(item => 
          item.id_producto === producto.id_producto 
            ? { ...item, cantidad: item.cantidad + cantidad } 
            : item
        ));
      } else {
        // Si es un producto nuevo, añadirlo al carrito
        setCarrito([...carrito, { 
          ...producto, 
          cantidad 
        }]);
      }
      
      // Mostrar mensaje de éxito
      alert(`${producto.nombre} añadido al carrito`);
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      alert("Error al añadir al carrito: " + error.message);
    }
  };

  // Función para eliminar del carrito
  const eliminarDeCarrito = async (idProducto) => {
    try {
      if (!idCarrito) {
        throw new Error("No se ha encontrado un carrito para el usuario");
      }
      
      // Llamar a la API para eliminar el producto del carrito
      await eliminarProductoDeCarrito(idCarrito, idProducto);
      
      // Actualizar el estado local del carrito
      setCarrito(carrito.filter(item => item.id_producto !== idProducto));
      
      // Mostrar mensaje de éxito
      alert("Producto eliminado del carrito");
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
      alert("Error al eliminar del carrito: " + error.message);
    }
  };

  // Función para actualizar la cantidad de un producto en el carrito
  const actualizarCantidad = async (idProducto, nuevaCantidad) => {
    try {
      if (!idCarrito) {
        throw new Error("No se ha encontrado un carrito para el usuario");
      }
      
      // Llamar a la API para actualizar la cantidad del producto en el carrito
      await añadirProductoACarrito(idCarrito, idProducto, nuevaCantidad);
      
      // Actualizar el estado local del carrito
      setCarrito(carrito.map(item => 
        item.id_producto === idProducto 
          ? { ...item, cantidad: nuevaCantidad } 
          : item
      ));
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
      alert("Error al actualizar la cantidad: " + error.message);
    }
  };

  // Funciones para manejar el detalle del producto
  const handleVerDetalle = (producto) => {
    setProductoSeleccionado(producto);
  };

  const handleCerrarDetalle = () => {
    setProductoSeleccionado(null);
  };

  // Función para manejar la búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults(null);
      return;
    }

    const filteredProducts = productos.filter(producto => 
      producto.nombre.toLowerCase().includes(term.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(term.toLowerCase())
    );
    
    setSearchResults(filteredProducts);
  };

  // Productos a mostrar (resultados de búsqueda o todos los productos)
  const displayProducts = searchResults !== null ? searchResults : productos;

  return (
    <div className="global">
      <NavbarComponent 
        userType="cliente" 
        onSearch={handleSearch}
        onClearSearch={() => setSearchResults(null)}
        cartItemCount={carrito.length}
        onCartClick={() => setShowCarrito(true)}
        onProductSelect={handleVerDetalle}
      />
      
      <Container fluid className="px-4 py-5">
        {/* Carrusel de productos destacados */}
        <section className="mb-5">
          <Carrusel featuredProductIds={[21, 22, 23, 24]} />
        </section>

        {/* Sección de productos */}
        <section>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Todos los Productos</h2>
            
            {searchResults !== null && (
              <div className="d-flex align-items-center">
                <span className="me-3">
                  {searchResults.length === 0 
                    ? "No se encontraron resultados" 
                    : `${searchResults.length} productos encontrados`}
                </span>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSearchResults(null);
                  }}
                >
                  Limpiar búsqueda
                </Button>
              </div>
            )}
          </div>
          
          {loading ? (
            <Loading message="Cargando productos..." />
          ) : error ? (
            <div className="alert alert-danger">
              {error}
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {displayProducts.length > 0 ? (
                displayProducts.map((producto) => (
                  <Col key={producto.id_producto} id={`producto-${producto.id_producto}`}>
                    <Producto 
                      producto={producto} 
                      onVerDetalle={handleVerDetalle} 
                    />
                  </Col>
                ))
              ) : (
                <Col xs={12}>
                  <div className="text-center py-5">
                    <p className="lead">No se encontraron productos que coincidan con tu búsqueda.</p>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </section>
      </Container>

      {/* Modal de detalle de producto */}
      {productoSeleccionado && (
        <ProductoDetalle 
          producto={productoSeleccionado} 
          añadirACarrito={añadirACarrito} 
          onCerrarDetalle={handleCerrarDetalle} 
        />
      )}

      {/* Modal del carrito */}
      <CarritoModal 
        show={showCarrito} 
        onHide={() => setShowCarrito(false)} 
        carrito={carrito} 
        eliminarDeCarrito={eliminarDeCarrito}
        actualizarCantidad={actualizarCantidad}
        usuarioAutenticado={usuarioAutenticado}
        idCarrito={idCarrito}
      />

      <style jsx global>{`
        .producto-card {
          transition: transform 0.3s, box-shadow 0.3s;
          height: 100%;
        }
        
        .producto-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .producto-imagen-container {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background-color: #f8f9fa;
        }
        
        .producto-imagen {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
        }
        
        .producto-nombre {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .producto-descripcion {
          font-size: 0.9rem;
          color: #6c757d;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .producto-precio {
          font-size: 1.2rem;
          font-weight: 700;
          color: #212529;
        }
        
        .detalle-btn {
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
