'use client';
import React, { useState } from 'react';
import { Card, Button, Badge, Modal, Row, Col, Form, Alert } from 'react-bootstrap';
import { FaShoppingCart, FaStar, FaInfoCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const ProductCard = ({ product, userType = 'guest', isAdmin = false, onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const router = useRouter();

  const {
    id,
    name,
    description,
    price,
    image,
    category,
    stock
  } = product;

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowLoginAlert(false);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (userType === 'guest') {
      setShowLoginAlert(true);
      return;
    }
    
    // Aquí iría la lógica para añadir al carrito
    console.log(`Añadido al carrito: ${name}, cantidad: ${quantity}`);
    
    // Cerrar el modal después de añadir al carrito
    handleCloseModal();
  };

  const handleLogin = () => {
    handleCloseModal(); // Cerrar el modal primero
    setTimeout(() => {
      router.push('/login');
    }, 100);
  };

  // Evitar que los clics en los botones de administración abran el modal
  const handleAdminAction = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <>
      <Card 
        className="h-100 shadow-sm product-card" 
        onClick={!isAdmin ? handleShowModal : undefined}
        style={{ 
          cursor: isAdmin ? 'default' : 'pointer',
          transition: 'transform 0.3s, box-shadow 0.3s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        }}
      >
        <div className="position-relative">
          <div style={{ 
            height: '200px', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: '#f8f9fa',
            borderTopLeftRadius: 'calc(0.375rem - 1px)',
            borderTopRightRadius: 'calc(0.375rem - 1px)'
          }}>
            <Card.Img 
              variant="top" 
              src={image || '/placeholder.jpg'} 
              style={{ 
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain'
              }}
              alt={name}
            />
          </div>
          {stock <= 5 && stock > 0 && (
            <Badge 
              bg="warning" 
              className="position-absolute top-0 end-0 m-2"
            >
              ¡Últimas unidades!
            </Badge>
          )}
          {stock === 0 && (
            <Badge 
              bg="danger" 
              className="position-absolute top-0 end-0 m-2"
            >
              Agotado
            </Badge>
          )}
        </div>
        <Card.Body className="d-flex flex-column">
          <div className="mb-2">
            <Badge bg="secondary" className="me-2">
              {category}
            </Badge>
          </div>
          <Card.Title className="h6 fw-bold text-truncate">{name}</Card.Title>
          <Card.Text className="text-muted small" style={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            fontSize: '0.8rem'
          }}>
            {description}
          </Card.Text>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center">
              <span className="h4 mb-0 fw-bold text-primary">{price ? `${price}€` : 'Precio no disponible'}</span>
              {isAdmin ? (
                <div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    className="me-2"
                    onClick={(e) => handleAdminAction(e, () => onEdit(product))}
                  >
                    <FaEdit /> Editar
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={(e) => handleAdminAction(e, () => onDelete(id))}
                  >
                    <FaTrash /> Eliminar
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  className="d-flex align-items-center gap-1"
                  onClick={handleShowModal}
                >
                  <FaInfoCircle />
                  Ver detalles
                </Button>
              )}
            </div>
            {stock > 0 && (
              <small className="text-success mt-2 d-block">
                {stock} unidades disponibles
              </small>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Modal de detalles del producto */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="lg" 
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <div className="d-flex align-items-center justify-content-center" style={{ height: '300px', backgroundColor: '#f8f9fa', borderRadius: '0.375rem' }}>
                <img 
                  src={image || '/placeholder.jpg'} 
                  alt={name} 
                  className="img-fluid rounded"
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>
            </Col>
            <Col md={6}>
              <h4 className="mb-3">{name}</h4>
              <div className="mb-3">
                <Badge bg="secondary" className="me-2">
                  {category}
                </Badge>
                <div className="d-flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-warning" />
                  ))}
                  <span className="ms-2 text-muted">(4.8/5)</span>
                </div>
              </div>
              <p className="text-muted">{description}</p>
              <h3 className="text-primary mb-3">{price ? `${price}€` : 'Precio no disponible'}</h3>
              
              {showLoginAlert && (
                <Alert variant="warning" className="mb-3">
                  <p className="mb-0">Debes iniciar sesión para añadir productos al carrito.</p>
                  <Button 
                    variant="link" 
                    className="p-0 mt-2" 
                    onClick={handleLogin}
                  >
                    Ir a iniciar sesión
                  </Button>
                </Alert>
              )}
              
              {stock > 0 ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max={stock}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                    />
                    <Form.Text className="text-success">
                      {stock} unidades disponibles
                    </Form.Text>
                  </Form.Group>
                  <Button 
                    variant="primary" 
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleAddToCart}
                  >
                    <FaShoppingCart />
                    Añadir al carrito
                  </Button>
                </>
              ) : (
                <Button 
                  variant="danger" 
                  className="w-100" 
                  disabled
                >
                  Producto agotado
                </Button>
              )}
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductCard;
