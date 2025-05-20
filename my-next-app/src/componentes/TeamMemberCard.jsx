'use client';
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

const TeamMemberCard = ({ member }) => {
  const {
    name,
    age,
    image,
    role,
    github,
    linkedin,
    email,
    description
  } = member;

  return (
    <Card className="team-card h-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="position-relative overflow-hidden">
        <Card.Img 
          variant="top" 
          src={image} 
          alt={name}
          className="team-member-image"
          style={{
            height: '300px',
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out'
          }}
        />
        <div className="image-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
          <div className="social-links d-flex gap-3">
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="text-white">
                <FaGithub size={24} />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-white">
                <FaLinkedin size={24} />
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="text-white">
                <FaEnvelope size={24} />
              </a>
            )}
          </div>
        </div>
      </div>
      <Card.Body className="text-center">
        <Card.Title as="h3" className="mb-1 fw-bold">{name}</Card.Title>
        <Card.Subtitle as="h4" className="mb-2 text-muted">{role}</Card.Subtitle>
        <Card.Text>
          {age && <span className="d-block">Edad: {age} años</span>}
          {description && <span className="d-block mt-2">{description}</span>}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="bg-transparent border-0 pb-3">
        <Link href="/" passHref>
          <Button variant="outline-primary" className="w-100">
            Volver al Inicio
          </Button>
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default TeamMemberCard;
