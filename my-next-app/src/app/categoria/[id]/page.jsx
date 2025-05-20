'use client';
import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/componentes/Loading';

export default function CategoriaRedirect({ params }) {
  const router = useRouter();
  const id = React.use(params).id;

  useEffect(() => {
    // Redirigir a la página de productos de la categoría
    router.push(`/categoria/${id}/productos`);
  }, [id, router]);

  return (
    <div className="container mt-5 text-center">
      <Loading message="Redirigiendo a productos de la categoría..." fullScreen={true} />
    </div>
  );
}
