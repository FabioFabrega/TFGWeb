'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import NavbarComponent from '@/componentes/Navbar';
import ProductCard from '@/componentes/ProductCard';
import Loading from '@/componentes/Loading';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ProductosCategoriaPage({ params }) {
  // Usar React.use para unwrap params
  const id = React.use(params).id;
  
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [userType, setUserType] = useState('guest'); // Por defecto guest, podría venir de un contexto de autenticación

  useEffect(() => {
    // Simulación de detección de tipo de usuario
    // En una aplicación real, esto vendría de un contexto de autenticación
    const path = window.location.pathname;
    if (path.includes('/admin')) {
      setUserType('admin');
    } else if (path.includes('/usuario')) {
      setUserType('cliente');
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Obtener información de la categoría con sus productos
        const categoriaResponse = await fetch(`http://143.47.56.237:3000/categorias/${id}`);
        if (!categoriaResponse.ok) {
          throw new Error('Error al obtener la categoría');
        }
        const categoriaData = await categoriaResponse.json();
        setCategoria(categoriaData);
        
        // Verificar si la categoría tiene productos
        if (categoriaData.productos && Array.isArray(categoriaData.productos)) {
          setProductos(categoriaData.productos);
        } else {
          console.warn('La categoría no tiene productos o el formato es incorrecto');
          setProductos([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Función para manejar la búsqueda
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      return;
    }

    const filteredProducts = productos.filter(producto => 
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(filteredProducts);
  };

  // Función para limpiar la búsqueda
  const clearSearch = () => {
    setSearchResults(null);
  };

  // Productos a mostrar (resultados de búsqueda o todos los productos)
  const displayProducts = searchResults !== null ? searchResults : productos;

  // Funciones para administradores
  const handleEditarProducto = (producto) => {
    // En una aplicación real, aquí se abriría un modal para editar el producto
    alert(`Editar producto: ${producto.nombre}`);
  };

  const handleEliminarProducto = (idProducto) => {
    // En una aplicación real, aquí se llamaría a la API para eliminar el producto
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      alert(`Producto eliminado: ${idProducto}`);
      // Actualizar la lista de productos
      setProductos(productos.filter(p => p.id_producto !== idProducto));
    }
  };

  if (loading) {
    return (
      <div>
        <NavbarComponent 
          userType={userType} 
          onSearch={handleSearch} 
          onClearSearch={clearSearch} 
        />
        <Container className="mt-4">
          <Loading message="Cargando productos..." />
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <NavbarComponent 
          userType={userType} 
          onSearch={handleSearch} 
          onClearSearch={clearSearch} 
        />
        <Container className="mt-4">
          <div className="alert alert-danger">
            Error: {error}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <NavbarComponent 
        userType={userType} 
        onSearch={handleSearch} 
        onClearSearch={clearSearch} 
      />
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>{categoria?.nombre || `Categoría ${id}`}</h1>
          
          {userType === 'admin' && (
            <Button 
              variant="success"
              onClick={() => alert('Añadir nuevo producto a esta categoría')}
            >
              Añadir Producto
            </Button>
          )}
        </div>
        
        {categoria?.descripcion && (
          <p className="lead mb-4">{categoria.descripcion}</p>
        )}

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
              onClick={clearSearch}
            >
              Limpiar búsqueda
            </Button>
          </div>
        )}

        <Row xs={1} md={2} lg={3} className="g-4">
          {displayProducts.length > 0 ? (
            displayProducts.map(producto => (
              <Col key={producto.id_producto} id={`producto-${producto.id_producto}`}>
                <ProductCard 
                  product={{
                    id: producto.id_producto,
                    name: producto.nombre,
                    description: producto.descripcion,
                    price: producto.precio,
                    image: producto.imagen,
                    category: categoria?.nombre,
                    stock: producto.stock || 10
                  }}
                  isAdmin={userType === 'admin'}
                  onEdit={userType === 'admin' ? () => handleEditarProducto(producto) : undefined}
                  onDelete={userType === 'admin' ? () => handleEliminarProducto(producto.id_producto) : undefined}
                />
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <Card className="text-center p-5">
                <Card.Body>
                  <Card.Title>No hay productos disponibles</Card.Title>
                  <Card.Text>
                    No se encontraron productos en esta categoría.
                  </Card.Text>
                  {userType === 'admin' && (
                    <Button 
                      variant="primary"
                      onClick={() => alert('Añadir nuevo producto a esta categoría')}
                    >
                      Añadir el primer producto
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}
