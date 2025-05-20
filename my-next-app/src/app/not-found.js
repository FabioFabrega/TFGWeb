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
            <img src="/404.png" />
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
            </div>
          </Col>
        </Row>
        
        <Row className="mt-5 pt-5">
        </Row>
      </Container>
    </div>
  );
}
