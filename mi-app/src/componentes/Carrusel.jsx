'use client'
import { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './estiloCarrusel.css';
import Loading from './Loading';

function Carrusel({ featuredProductIds = [1, 2, 3, 4] }) {
  const [index, setIndex] = useState(0);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        // Primero obtenemos todos los productos
        const allProductsResponse = await fetch('http://143.47.56.237:3000/productos');
        if (!allProductsResponse.ok) {
          throw new Error('Error al obtener productos');
        }
        
        const allProducts = await allProductsResponse.json();
        
        // Filtramos los productos destacados o usamos los primeros 4 si no se encuentran
        let productosDestacados = [];
        
        // Intentamos obtener los productos por ID
        for (const id of featuredProductIds) {
          const producto = allProducts.find(p => p.id_producto === id);
          if (producto) {
            productosDestacados.push(producto);
          }
        }
        
        // Si no encontramos suficientes productos, usamos los primeros de la lista
        if (productosDestacados.length < 4) {
          const productosFaltantes = 4 - productosDestacados.length;
          const productosAdicionales = allProducts
            .filter(p => !featuredProductIds.includes(p.id_producto))
            .slice(0, productosFaltantes);
          
          productosDestacados = [...productosDestacados, ...productosAdicionales];
        }
        
        setProductos(productosDestacados);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar productos destacados:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProductos();
  }, [featuredProductIds]);

  if (loading) {
    return <Loading message="Cargando productos destacados..." />;
  }

  if (error) {
    return <div className="error-message">Error al cargar productos: {error}</div>;
  }

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">Productos Destacados</h2>
      {productos.length > 0 ? (
        <Carousel activeIndex={index} onSelect={handleSelect} className="custom-carousel">
          {productos.map((producto) => (
            <Carousel.Item key={producto.id_producto}>
              <div className="carousel-image-container">
                <img 
                  src={producto.imagen || "https://via.placeholder.com/800x400?text=Imagen+no+disponible"} 
                  alt={producto.nombre} 
                />
              </div>
              <Carousel.Caption className="carousel-caption">
                <h3>{producto.nombre}</h3>
                <p>{producto.descripcion}</p>
                <Button 
                  variant="primary" 
                  className="mt-2"
                  onClick={() => window.location.href = `/#producto-${producto.id_producto}`}
                >
                  Ver detalles
                </Button>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <div className="no-products">No hay productos destacados disponibles</div>
      )}
    </div>
  );
}

export default Carrusel;
