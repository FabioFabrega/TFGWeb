'use client'
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Card, Form, Button, Container, Alert } from 'react-bootstrap';
import Link from 'next/link';
import NavbarComponent from '@/componentes/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './estilo.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://143.47.56.237:3000/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.access_token);
      const decodedToken = JSON.parse(atob(response.data.access_token.split('.')[1]));
      
      if (decodedToken.rol === 'admin') {
        router.push('../cesta/admin');
      } else if (decodedToken.rol === 'usuario') {
        router.push('../cesta/usuario');
      }
    } catch (err) {
      setError('Credenciales inválidas');
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
              <Card.Title as="h1" className="text-center mb-4">Iniciar sesión</Card.Title>
              
              {error && (
                <Alert variant="danger">{error}</Alert>
              )}
              
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    {loading ? 'Cargando...' : 'Iniciar sesión'}
                  </Button>
                  
                  <Link href="/" passHref>
                    <Button variant="primary">
                      Volver al inicio
                    </Button>
                  </Link>
                </div>
              </Form>
              
              <div className="text-center mt-3">
                <p>¿No tienes cuenta? <Link href="/regis">Regístrate</Link></p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}
