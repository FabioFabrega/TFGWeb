'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoPersonCircle } from 'react-icons/io5';
import { FaSearch } from 'react-icons/fa';
import { Navbar, Nav, Dropdown, Container, Form, InputGroup, Button, Modal, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import TeamModal from './TeamModal';
import Loading from './Loading';

// Componente Navbar reutilizable que se adapta según el tipo de usuario
export default function NavbarComponent({ userType = 'guest', onSearch, onClearSearch, cartItemCount = 0, onCartClick, onProductSelect }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  
  // Estados para el modal de categorías
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [productosCategoria, setProductosCategoria] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);

  // Datos de los miembros del equipo
  const teamMembers = {
    Fabio: {
      name: 'Fabio',
      role: 'Desarrollador Frontend',
      image: 'https://img.freepik.com/vector-gratis/nino-sonriente-cabello-oscuro_1308-174422.jpg?t=st=1742123183~exp=1742126783~hmac=7c092fc8ac9bd9a23af40a96dab6e3b88a28498bb4360341f970a88a94471d9c&w=740',
      bio: 'Especialista en desarrollo frontend con experiencia en React y Next.js. Apasionado por crear interfaces de usuario intuitivas y atractivas.',
      skills: ['React', 'Next.js', 'JavaScript', 'CSS', 'Bootstrap'],
      github: 'https://github.com/FabioFabrega',
      linkedin: 'https://linkedin.com/in/fabio',
      email: 'fabiofabrega746@gmail.com'
    },
    Deyvid: {
      name: 'Deyvid Rios',
      role: 'Desarrollador Full Stack',
      image: 'https://img.freepik.com/vector-gratis/ilustracion-joven-sonriente_1308-174669.jpg',
      bio: 'Apasionado por la administración de sistemas y la seguridad informática. Enfocado en optimizar infraestructuras de TI y garantizar la protección de datos en entornos empresariales.',
      skills: ['Node.js', 'Express', 'SQL', 'API REST', 'AWS', 'Docker'],
      github: 'https://github.com/Deyvid0104',
      linkedin: 'https://linkedin.com/in/deyvid-rios-634569168',
      email: 'deyvidriost@gmail.com'
    },
    Kevin: {
      name: 'Kevin',
      role: 'Diseñador UX/UI',
      image: 'https://via.placeholder.com/300',
      bio: 'Diseñador UX/UI con experiencia en la creación de experiencias de usuario atractivas y funcionales. Especializado en diseño responsive y accesibilidad web.',
      skills: ['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping'],
      github: 'https://github.com/kevin',
      linkedin: 'https://linkedin.com/in/kevin',
      email: 'kevin@example.com'
    }
  };

  useEffect(() => {
    // Función para obtener las categorías de la API
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://143.47.56.237:3000/categorias');
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data = await response.json();
        setCategorias(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  // Función para obtener productos por categoría
  const fetchProductosByCategoria = async (categoriaId) => {
    setLoadingProductos(true);
    try {
      // Intentar obtener información de la categoría con sus productos
      const categoriaResponse = await fetch(`http://143.47.56.237:3000/categorias/${categoriaId}`);
      if (!categoriaResponse.ok) {
        // Si falla, intentar obtener todos los productos y filtrar
        console.log(`No se pudo obtener la categoría ${categoriaId} directamente, intentando filtrar productos...`);
        const productosResponse = await fetch(`http://143.47.56.237:3000/productos`);
        if (!productosResponse.ok) {
          throw new Error('Error al obtener los productos');
        }
        
        const allProducts = await productosResponse.json();
        
        // Filtrar los productos por categoría
        // Convertir categoriaId a número para comparación correcta
        const categoriaIdNum = parseInt(categoriaId, 10);
        
        const filteredProducts = allProducts.filter(
          producto => parseInt(producto.id_categoria, 10) === categoriaIdNum
        );
        
        console.log(`Productos filtrados para categoría ${categoriaId}:`, filteredProducts);
        setProductosCategoria(filteredProducts);
      } else {
        // Si la categoría se obtiene correctamente, verificar si tiene productos
        const categoriaData = await categoriaResponse.json();
        console.log(`Datos de categoría ${categoriaId}:`, categoriaData);
        
        if (categoriaData.productos && Array.isArray(categoriaData.productos)) {
          console.log(`Productos de categoría ${categoriaId}:`, categoriaData.productos);
          setProductosCategoria(categoriaData.productos);
        } else {
          // Si la categoría no tiene productos, obtener todos los productos y filtrar
          console.log(`La categoría ${categoriaId} no tiene productos en la respuesta, intentando filtrar...`);
          const productosResponse = await fetch(`http://143.47.56.237:3000/productos`);
          if (!productosResponse.ok) {
            throw new Error('Error al obtener los productos');
          }
          
          const allProducts = await productosResponse.json();
          
          // Filtrar los productos por categoría
          const categoriaIdNum = parseInt(categoriaId, 10);
          
          const filteredProducts = allProducts.filter(
            producto => parseInt(producto.id_categoria, 10) === categoriaIdNum
          );
          
          console.log(`Productos filtrados para categoría ${categoriaId}:`, filteredProducts);
          setProductosCategoria(filteredProducts);
        }
      }
      setLoadingProductos(false);
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      setLoadingProductos(false);
      // En caso de error, intentar con el método alternativo
      try {
        console.log('Intentando método alternativo para obtener productos...');
        const productosResponse = await fetch(`http://143.47.56.237:3000/productos`);
        if (!productosResponse.ok) {
          throw new Error('Error al obtener los productos (método alternativo)');
        }
        
        const allProducts = await productosResponse.json();
        
        // Filtrar los productos por categoría
        const categoriaIdNum = parseInt(categoriaId, 10);
        
        const filteredProducts = allProducts.filter(
          producto => parseInt(producto.id_categoria, 10) === categoriaIdNum
        );
        
        console.log(`Productos filtrados (método alternativo) para categoría ${categoriaId}:`, filteredProducts);
        setProductosCategoria(filteredProducts);
        setLoadingProductos(false);
      } catch (fallbackError) {
        console.error('Error en método alternativo:', fallbackError);
        setProductosCategoria([]);
        setLoadingProductos(false);
      }
    }
  };

  // Función para manejar el clic en una categoría
  const handleCategoriaClick = (categoria) => {
    setSelectedCategoria(categoria);
    fetchProductosByCategoria(categoria.id_categoria);
    setShowCategoriaModal(true);
  };

  // Función para manejar el clic en un producto (para cualquier tipo de usuario)
  const handleProductClick = (producto) => {
    if (userType === 'cliente' && onProductSelect) {
      handleCloseCategoriaModal();
      onProductSelect(producto);
    } else if (userType === 'cliente') {
      // Si no hay onProductSelect, mostrar detalles del producto
      console.log('Mostrando detalles del producto:', producto);
      // Aquí podrías abrir un modal de detalles o redirigir a la página del producto
    } else if (userType === 'guest') {
      // Para usuarios no autenticados, mostrar detalles y redirigir a login si intentan comprar
      console.log('Usuario no autenticado viendo producto:', producto);
      // Podríamos mostrar un modal con los detalles del producto
      // y un botón para iniciar sesión si quieren comprarlo
      if (window.confirm(`Para añadir "${producto.nombre}" al carrito, necesitas iniciar sesión. ¿Deseas iniciar sesión ahora?`)) {
        handleCloseCategoriaModal();
        window.location.href = '/login';
      }
    }
  };

  // Función para manejar la edición de un producto (para administradores)
  const handleEditProduct = (producto) => {
    if (userType === 'admin') {
      console.log('Editando producto:', producto);
      handleCloseCategoriaModal();
      // Aquí podrías abrir un modal de edición o redirigir a la página de edición
      if (window.openEditProductModal) {
        window.openEditProductModal(producto);
      } else {
        alert(`Editando producto: ${producto.nombre}`);
      }
    }
  };

  // Función para manejar la eliminación de un producto (para administradores)
  const handleDeleteProduct = (productoId) => {
    if (userType === 'admin') {
      console.log('Eliminando producto:', productoId);
      if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
        // Aquí iría la lógica para eliminar el producto
        alert(`Producto eliminado: ${productoId}`);
        // Actualizar la lista de productos
        setProductosCategoria(productosCategoria.filter(p => p.id_producto !== productoId));
      }
    }
  };

  // Manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  // Limpiar la búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  // Mostrar modal con información del miembro del equipo
  const handleShowModal = (memberName) => {
    setSelectedMember(teamMembers[memberName]);
    setShowModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Cerrar modal de categoría
  const handleCloseCategoriaModal = () => {
    setShowCategoriaModal(false);
    setSelectedCategoria(null);
    setProductosCategoria([]);
  };

  // Determinar los enlaces de inicio de sesión/registro o cierre de sesión
  const renderAuthLinks = () => {
    if (userType === 'guest') {
      return (
        <>
          <Link href="/login" className="text-white me-3 text-decoration-none">
            <IoPersonCircle className="me-1" />Login
          </Link>
          <Link href="/regis" className="text-white text-decoration-none">
            <IoPersonCircle className="me-1" />Registrar
          </Link>
        </>
      );
    } else {
      return (
        <Link href="/" className="text-white text-decoration-none">
          <IoPersonCircle className="me-1" />Cerrar sesión
        </Link>
      );
    }
  };

  // Determinar si mostrar el carrito
  const renderCart = () => {
    if (userType !== 'guest' && userType === 'cliente') {
      return (
        <Button 
          variant="success" 
          className="ms-3 d-flex align-items-center"
          onClick={onCartClick}
        >
          <i className="bi bi-cart me-2"></i>
          Mi cesta
          {cartItemCount > 0 && (
            <span className="badge bg-danger ms-2">{cartItemCount}</span>
          )}
        </Button>
      );
    }
    return null;
  };

  return (
    <header className="bg-dark text-white">
      <Container>
        <div className="head py-3">
          <Link href={userType === 'guest' ? '/' : userType === 'admin' ? '/cesta/admin' : '/cesta/usuario'} className="inicio">
            <h1>TechStore</h1>
          </Link>
          
          <Form onSubmit={handleSearch} className="d-flex">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Busca aquí..."
                aria-label="Buscar productos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="primary" type="submit">
                <FaSearch />
              </Button>
              {searchTerm && (
                <Button variant="outline-secondary" onClick={handleClearSearch}>
                  X
                </Button>
              )}
            </InputGroup>
          </Form>
          
          <div className="d-flex align-items-center">
            {renderAuthLinks()}
            {renderCart()}
          </div>
        </div>
        <hr className="hr_global" />
        <Nav className="mb-3">
          <Dropdown className="me-3">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Categorías
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {loading ? (
                <Dropdown.Item>
                  <Loading message="Cargando categorías..." />
                </Dropdown.Item>
              ) : error ? (
                <Dropdown.Item>Error al cargar categorías</Dropdown.Item>
              ) : (
                categorias.map((categoria) => (
                  <Dropdown.Item 
                    key={categoria.id_categoria} 
                    onClick={() => handleCategoriaClick(categoria)}
                  >
                    {categoria.nombre}
                  </Dropdown.Item>
                ))
              )}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Nuestro equipo
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleShowModal('Fabio')}>Fabio</Dropdown.Item>
              <Dropdown.Item onClick={() => handleShowModal('Deyvid')}>Deyvid</Dropdown.Item>
              <Dropdown.Item onClick={() => handleShowModal('Kevin')}>Kevin</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
      
      {/* Modal para mostrar información del miembro del equipo */}
      <TeamModal 
        show={showModal} 
        handleClose={handleCloseModal} 
        member={selectedMember} 
      />

      {/* Modal para mostrar productos de la categoría seleccionada */}
      <Modal 
        show={showCategoriaModal} 
        onHide={handleCloseCategoriaModal}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCategoria ? selectedCategoria.nombre : 'Categoría'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCategoria && selectedCategoria.descripcion && (
            <p className="lead mb-4">{selectedCategoria.descripcion}</p>
          )}
          
          {loadingProductos ? (
            <Loading message="Cargando productos..." />
          ) : productosCategoria.length > 0 ? (
            <Row xs={1} md={2} lg={3} className="g-4">
              {productosCategoria.map((producto) => (
                <Col key={producto.id_producto}>
                  <Card className="h-100 shadow-sm producto-card">
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                      <Card.Img 
                        variant="top" 
                        src={producto.imagen || "/placeholder.jpg"} 
                        alt={producto.nombre} 
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {producto.nombre}
                      </Card.Title>
                      <Card.Text style={{ fontSize: '0.9rem', color: '#6c757d', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {producto.descripcion}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#212529' }}>
                          {producto.precio} €
                        </span>
                        {userType === 'admin' ? (
                          <div>
                            <Button 
                              variant="warning" 
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditProduct(producto)}
                            >
                              Editar
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleDeleteProduct(producto.id_producto)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleProductClick(producto)}
                          >
                            {userType === 'cliente' ? 'Añadir al carrito' : 'Ver detalles'}
                          </Button>
                        )}
                      </div>
                      {producto.stock > 0 && (
                        <small className="text-success mt-2 d-block">
                          {producto.stock} unidades disponibles
                        </small>
                      )}
                      {producto.stock === 0 && (
                        <small className="text-danger mt-2 d-block">
                          Agotado
                        </small>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <p className="lead">No hay productos disponibles en esta categoría.</p>
              {userType === 'admin' && (
                <Button 
                  variant="primary"
                  onClick={() => {
                    handleCloseCategoriaModal();
                    alert('Añadir nuevo producto a esta categoría');
                  }}
                >
                  Añadir el primer producto
                </Button>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCategoriaModal}>
            Cerrar
          </Button>
          {userType === 'admin' && productosCategoria.length > 0 && (
            <Button 
              variant="success"
              onClick={() => {
                // Guardar el ID de la categoría actual para usarlo al crear el producto
                if (selectedCategoria) {
                  // Almacenar el ID de la categoría en localStorage o en una variable global
                  localStorage.setItem('selectedCategoriaId', selectedCategoria.id_categoria);
                  console.log(`Categoría seleccionada para nuevo producto: ${selectedCategoria.nombre} (ID: ${selectedCategoria.id_categoria})`);
                }
                handleCloseCategoriaModal();
                alert(`Añadiendo nuevo producto a la categoría: ${selectedCategoria ? selectedCategoria.nombre : 'desconocida'}`);
              }}
            >
              Añadir Producto
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </header>
  );
}
