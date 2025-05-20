'use client';
import React from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const TeamModal = ({ show, handleClose, member }) => {
  if (!member) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Miembro del Equipo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4} className="text-center mb-4 mb-md-0">
            <img 
              src={member.image} 
              alt={member.name} 
              className="img-fluid rounded-circle mb-3"
              style={{ maxWidth: '200px', border: '5px solid #f8f9fa' }}
            />
            <h3 className="mb-1">{member.name}</h3>
            <p className="text-muted">{member.role}</p>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <FaGithub />
              </a>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary fs-4">
                <FaLinkedin />
              </a>
              <a href={`mailto:${member.email}`} className="text-danger fs-4">
                <FaEnvelope />
              </a>
            </div>
          </Col>
          <Col md={8}>
            <h4 className="mb-3">Biografía</h4>
            <p>{member.bio}</p>
            
            <h4 className="mb-3 mt-4">Habilidades</h4>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {member.skills.map((skill, index) => (
                <Badge key={index} bg="primary" className="p-2">
                  {skill}
                </Badge>
              ))}
            </div>
            
            <h4 className="mb-3 mt-4">Proyectos Destacados</h4>
            <ul className="list-group">
              <li className="list-group-item">
                <strong>TechStore</strong> - Tienda online de productos tecnológicos
              </li>
              <li className="list-group-item">
                <strong>Portfolio Personal</strong> - Sitio web con proyectos y experiencia
              </li>
              <li className="list-group-item">
                <strong>Blog Tech</strong> - Blog sobre tecnología y desarrollo web
              </li>
            </ul>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TeamModal;
