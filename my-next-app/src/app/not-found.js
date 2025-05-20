'use client';
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import { FaHome, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import NavbarComponent from '@/componentes/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function NotFound() {
  return (
    <div>
      <NavbarComponent />
      <Container className="py-5 text-center">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="mb-4">
              <FaExclamationTriangle className="text-warning" style={{ fontSize: '5rem' }} />
            </div>
            <h1 className="display-1 fw-bold text-danger mb-4">404</h1>
            <h2 className="mb-4">Página no encontrada</h2>
            <p className="lead text-muted mb-5">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
              Por favor, verifica la URL o regresa a la página de inicio.
            </p>
            <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
              <Link href="/" passHref>
                <Button variant="primary" size="lg" className="d-flex align-items-center justify-content-center gap-2">
                  <FaHome />
                  Volver al inicio
                </Button>
              </Link>
              <Link href="/" passHref>
                <Button variant="outline-secondary" size="lg" className="d-flex align-items-center justify-content-center gap-2">
                  <FaSearch />
                  Buscar productos
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
        
        <Row className="mt-5 pt-5">
          <Col>
            <h3 className="h5 mb-4">¿Buscabas alguna de estas páginas?</h3>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link href="/categoria/1" className="text-decoration-none">
                <span className="badge bg-light text-dark p-2 fs-6">Portátiles</span>
              </Link>
              <Link href="/categoria/2" className="text-decoration-none">
                <span className="badge bg-light text-dark p-2 fs-6">Smartphones</span>
              </Link>
              <Link href="/categoria/3" className="text-decoration-none">
                <span className="badge bg-light text-dark p-2 fs-6">Accesorios</span>
              </Link>
              <Link href="/login" className="text-decoration-none">
                <span className="badge bg-light text-dark p-2 fs-6">Iniciar sesión</span>
              </Link>
              <Link href="/regis" className="text-decoration-none">
                <span className="badge bg-light text-dark p-2 fs-6">Registrarse</span>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
