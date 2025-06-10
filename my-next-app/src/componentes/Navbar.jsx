'use client'
import { useState } from 'react';
import Link from 'next/link';
import { IoPersonCircle } from 'react-icons/io5';
import { FaSearch } from 'react-icons/fa';
import { Button, Container, Form, InputGroup } from 'react-bootstrap'; // Importa Button aquí
import 'bootstrap/dist/css/bootstrap.min.css';
import "../app/globals.css";

// Componente Navbar reutilizable que se adapta según el tipo de usuario
export default function NavbarComponent({ userType = 'guest', onSearch, cartItemCount = 0, onCartClick, onProductSelect }) {
  const [searchTerm, setSearchTerm] = useState('');

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

  // Determinar los enlaces de inicio de sesión/registro o cierre de sesión
  const renderAuthLinks = () => {
    if (userType === 'guest') {
      return (
        <div><div><h3>
          <Link href="/login" className="text-white me-3 text-decoration-none">
            <IoPersonCircle className="me-1" />Login
          </Link></h3></div>
          <div><h3>
          <Link href="/regis" className="text-white text-decoration-none">
            <IoPersonCircle className="me-1" />Registrer
          </Link>
        </h3></div></div>
      );
    } else {
      return (
        <h3><Link href="/" className="text-white text-decoration-none">
          <IoPersonCircle className="me-1" />Cerrar sesión
        </Link></h3>
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
    <header>
      <Container>
        <div className="head py-3">
          <Link href={userType === 'guest' ? '/' : userType === 'admin' ? '/cesta/admin' : '/cesta/usuario'} className="inicio">
             <h1>Pc<img src="/logo.png" className='logo'/>Laptop</h1>
          </Link>
          
          <Form onSubmit={handleSearch} className="d-flex">
            <InputGroup>
            <div className='buscador'>
              <Form.Control
                type="text"
                placeholder="Busca aquí..."
                aria-label="Buscar productos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="primary" type="submit" className='buscar'>
                <FaSearch />
              </Button>
              {searchTerm && (
                <Button variant="outline-secondary" onClick={handleClearSearch} className='limpiar'>
                  X
                </Button>
              )}
            </div></InputGroup>
          </Form>
          
          <div className="d-flex align-items-center">
            {renderAuthLinks()}
            {renderCart()}
          </div>
        </div>
      </Container>
    </header>
  );
}
