'use client';
import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from "@/componentes/Navbar";
import Carrusel from "@/componentes/Carrusel";
import ProductCard from "@/componentes/ProductCard";
import Loading from "@/componentes/Loading";
import "./globals.css";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  
  // IDs de productos destacados para el carrusel (pueden ser modificados fácilmente)
  const featuredProductIds = [21, 22, 23, 24]; 

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("http://143.47.56.237:3000/productos");
        if (!res.ok) {
          throw new Error("Error al obtener productos");
        }
        const data = await res.json();
        setProductos(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []); 

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

  return (
    <div className="global">
      <NavbarComponent onSearch={handleSearch} onClearSearch={clearSearch} />
      
      <Container fluid className="px-4 py-5">
        {/* Carrusel de productos destacados */}
        <section className="mb-5">
          <Carrusel featuredProductIds={featuredProductIds} />
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
                  onClick={clearSearch}
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
              Error al cargar productos: {error}
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {displayProducts.length > 0 ? (
                displayProducts.map((producto) => (
                  <Col key={producto.id_producto} id={`producto-${producto.id_producto}`}>
                    <ProductCard 
                      product={{
                        id: producto.id_producto,
                        name: producto.nombre,
                        description: producto.descripcion,
                        price: producto.precio,
                        image: producto.imagen,
                        category: producto.categoria,
                        stock: producto.stock || 10
                      }} 
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
    </div>
  );
}
