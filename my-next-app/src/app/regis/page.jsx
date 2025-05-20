'use client';
import React, { useState } from 'react';
import { Card, Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NavbarComponent from '@/componentes/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './estilo.css';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    direccion: '',
    telefono: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    return Object.values(formData).every(field => field.trim() !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMessage('Por favor, complete todos los campos.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://143.47.56.237:3000/usuarios/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al registrar usuario: ${errorData.message || 'Desconocido'}`);
      }

      const data = await response.json();
      console.log('Usuario registrado:', data);

      router.push('../login');
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error al registrar usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarComponent />
      <Container fluid className="auth-container">
        <div className="auth-form-container">
          <Card className="auth-card">
            <Card.Body>
              <Card.Title as="h1" className="text-center mb-4">Crear cuenta</Card.Title>
              
              {errorMessage && (
                <Alert variant="danger">{errorMessage}</Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="apellido"
                        placeholder="Apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="direccion"
                    placeholder="Dirección"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Control
                    type="text"
                    name="telefono"
                    placeholder="Número de Teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button 
                    variant="success" 
                    type="submit" 
                    className="mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Cargando...' : 'Registrar'}
                  </Button>
                  
                  <Link href="/" passHref>
                    <Button variant="primary">
                      Volver al inicio
                    </Button>
                  </Link>
                </div>
              </Form>
              
              <div className="text-center mt-3">
                <p>¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link></p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}
