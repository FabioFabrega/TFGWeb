'use client';
import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const Loading = ({ message = 'Cargando...', fullScreen = false }) => {
  const loadingContent = (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
      {message && <p className="mt-3 text-center text-muted">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {loadingContent}
      </div>
    );
  }

  return loadingContent;
};

export default Loading;
