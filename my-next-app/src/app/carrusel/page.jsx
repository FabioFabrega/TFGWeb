'use client'
import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './estilo.css'

function Carrusel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const productos = [
    {
      imagen: "https://m.media-amazon.com/images/I/8140bl19JAL._AC_UF894,1000_QL80_.jpg",
      titulo: "Portátil Gaming HP Victus 16",
      descripcion: "AMD Ryzen 7, 16GB RAM, 512GB SSD, RTX 4060"
    },
    {
      imagen: "https://m.media-amazon.com/images/I/71zmWJg5J8L.jpg",
      titulo: "Torre Gaming MSI MAG Forge 100M",
      descripcion: "Cristal Templado, USB 3.2, RGB"
    },
    {
      imagen: "https://m.media-amazon.com/images/I/61XNfWEuj1L.jpg",
      titulo: "Monitor Gaming LG 27GP850-B",
      descripcion: "27\" LED NanoIPS QHD 180Hz 1ms"
    },
    {
      imagen: "https://elevengamesar.com/img/Public/1131-producto-medidas-para-mercado-libre-2023-10-24t180408-586-807.jpg",
      titulo: "Teclado Razer BlackWidow V4 Pro",
      descripcion: "Mecánico Gaming RGB Switch Green"
    }
  ];

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">Productos Destacados</h2>
      <Carousel activeIndex={index} onSelect={handleSelect} className="custom-carousel">
        {productos.map((producto, idx) => (
          <Carousel.Item key={idx}>
            <div className="carousel-image-container">
              <img src={producto.imagen} alt={producto.titulo} />
            </div>
            <Carousel.Caption className="carousel-caption">
              <h3>{producto.titulo}</h3>
              <p>{producto.descripcion}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default Carrusel;
