'use client';
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Modal, Table, Badge } from 'react-bootstrap';
import { FaEuroSign, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import NavbarComponent from "@/componentes/Navbar";
import Loading from "@/componentes/Loading";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

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

// Función para obtener categorías
async function getCategorias() {
  try {
    const res = await fetch("http://143.47.56.237:3000/categorias");
    if (!res.ok) {
      throw new Error("Failed to fetch categorias");
    }
    return res.json();
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
}

// Función para crear un producto
async function createProducto(productoData, token) {
  try {
    const res = await axios.post("http://143.47.56.237:3000/productos", productoData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
}

// Función para eliminar un producto
async function deleteProducto(id, token) {
  try {
    await axios.delete(`http://143.47.56.237:3000/productos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
}

// Función para actualizar un producto
async function updateProducto(id, productoData, token) {
  try {
    const res = await axios.put(`http://143.47.56.237:3000/productos/${id}`, productoData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
}

// Componente de producto
const Producto = ({ producto, onEliminar, onEditar }) => (
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
      <div className="mb-2">
        <Badge bg="secondary" className="me-2">
          {producto.categoria || 'Sin categoría'}
        </Badge>
        {producto.stock > 0 ? (
          <Badge bg="success">Stock: {producto.stock}</Badge>
        ) : (
          <Badge bg="danger">Sin stock</Badge>
        )}
      </div>
      <Card.Title className="producto-nombre">{producto?.nombre}</Card.Title>
      <Card.Text className="producto-descripcion flex-grow-1">{producto?.descripcion}</Card.Text>
      <div className="d-flex justify-content-between align-items-center mt-auto">
        <span className="producto-precio">{producto?.precio} <FaEuroSign /></span>
        <div>
          <Button 
            variant="outline-primary" 
            size="sm"
            className="me-2"
            onClick={() => onEditar(producto)}
          >
            <FaEdit /> Editar
          </Button>
          <Button 
            variant="outline-danger" 
            size="sm"
            onClick={() => onEliminar(producto.id_producto)}
          >
            <FaTrash /> Eliminar
          </Button>
        </div>
      </div>
    </Card.Body>
  </Card>
);

// Componente de formulario para añadir/editar producto
const ProductoForm = ({ producto, categorias, onSubmit, onCancel, title }) => {
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || '',
    precio: producto?.precio || '',
    stock: producto?.stock || '',
    descripcion: producto?.descripcion || '',
    imagen: producto?.imagen || '',
    id_categoria: producto?.id_categoria || '',
    marca: producto?.marca || '',
    modelo: producto?.modelo || ''
  });
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Nombre del producto"
              />
              <Form.Control.Feedback type="invalid">
                Por favor ingrese un nombre.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Precio (€)</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              <Form.Control.Feedback type="invalid">
                Por favor ingrese un precio válido.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="Cantidad disponible"
              />
              <Form.Control.Feedback type="invalid">
                Por favor ingrese una cantidad válida.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Por favor seleccione una categoría.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Imagen URL</Form.Label>
              <Form.Control
                type="url"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="URL de la imagen"
              />
              <Form.Text className="text-muted">
                Ingrese la URL de la imagen del producto.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                placeholder="Marca del producto"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Modelo</Form.Label>
              <Form.Control
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                placeholder="Modelo del producto"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Descripción del producto"
              />
              <Form.Control.Feedback type="invalid">
                Por favor ingrese una descripción.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          {producto ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </Modal.Footer>
    </Form>
  );
};

export default function AdminPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  // Exponer la función de edición para que pueda ser llamada desde el modal de categorías
  useEffect(() => {
    window.openEditProductModal = (producto) => {
      setProductoSeleccionado(producto);
      setShowModal(true);
    };

    // Limpieza al desmontar el componente
    return () => {
      window.openEditProductModal = undefined;
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosData, categoriasData] = await Promise.all([
          getProductos(),
          getCategorias()
        ]);
        
        if (productosData) {
          setProductos(productosData);
        } else {
          setError("No se pudieron cargar los productos");
        }
        
        if (categoriasData) {
          setCategorias(categoriasData);
        }
        
        setLoading(false);
      } catch (error) {
        setError("Error al cargar datos: " + error.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleCrearProducto = (formData) => {
    // En una aplicación real, aquí se llamaría a la API
    // const token = localStorage.getItem('token');
    // const nuevoProducto = await createProducto(formData, token);
    
    // Simulación de creación
    const nuevoProducto = {
      id_producto: Date.now(), // Simulamos un ID único
      ...formData,
      categoria: categorias.find(c => c.id_categoria == formData.id_categoria)?.nombre
    };
    
    setProductos([nuevoProducto, ...productos]);
    setShowModal(false);
    alert("Producto creado con éxito");
  };

  const handleEditarProducto = (formData) => {
    // En una aplicación real, aquí se llamaría a la API
    // const token = localStorage.getItem('token');
    // await updateProducto(productoSeleccionado.id_producto, formData, token);
    
    // Simulación de actualización
    const productosActualizados = productos.map(producto => 
      producto.id_producto === productoSeleccionado.id_producto 
        ? { 
            ...producto, 
            ...formData,
            categoria: categorias.find(c => c.id_categoria == formData.id_categoria)?.nombre
          } 
        : producto
    );
    
    setProductos(productosActualizados);
    setShowModal(false);
    setProductoSeleccionado(null);
    alert("Producto actualizado con éxito");
  };

  const handleEliminarProducto = (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este producto?")) {
      // En una aplicación real, aquí se llamaría a la API
      // const token = localStorage.getItem('token');
      // await deleteProducto(id, token);
      
      // Simulación de eliminación
      setProductos(productos.filter(producto => producto.id_producto !== id));
      alert("Producto eliminado con éxito");
    }
  };

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
        userType="admin" 
        onSearch={handleSearch}
        onClearSearch={() => setSearchResults(null)}
      />
      
      <Container fluid className="px-4 py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestión de Productos</h2>
          <Button 
            variant="success" 
            onClick={() => {
              setProductoSeleccionado(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-2" /> Añadir Producto
          </Button>
        </div>
        
        {searchResults !== null && (
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              {searchResults.length === 0 ? (
                <div className="alert alert-info">
                  No se encontraron productos que coincidan con la búsqueda.
                </div>
              ) : (
                <p>Se encontraron {searchResults.length} resultados</p>
              )}
            </div>
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
                <Col key={producto.id_producto}>
                  <Producto 
                    producto={producto} 
                    onEditar={(producto) => {
                      setProductoSeleccionado(producto);
                      setShowModal(true);
                    }} 
                    onEliminar={handleEliminarProducto} 
                  />
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <div className="text-center py-5">
                  <p className="lead">No hay productos disponibles.</p>
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      setProductoSeleccionado(null);
                      setShowModal(true);
                    }}
                  >
                    Añadir el primer producto
                  </Button>
                </div>
              </Col>
            )}
          </Row>
        )}
      </Container>
      
      {/* Modal para añadir/editar producto */}
      <Modal 
        show={showModal} 
        onHide={() => {
          setShowModal(false);
          setProductoSeleccionado(null);
        }}
        size="lg"
        centered
      >
        <ProductoForm 
          producto={productoSeleccionado}
          categorias={categorias}
          onSubmit={productoSeleccionado ? handleEditarProducto : handleCrearProducto}
          onCancel={() => {
            setShowModal(false);
            setProductoSeleccionado(null);
          }}
          title={productoSeleccionado ? 'Editar Producto' : 'Añadir Producto'}
        />
      </Modal>

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
      `}</style>
    </div>
  );
}
