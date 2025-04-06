import React from 'react';
import ProductosList from './ProductosList';

const ProductoUsuarios = ({ isUserAuthenticated }) => {
  // Asegurarse de que el usuario esté autenticado (usando la prop o verificando el token)
  const isAuthenticated = isUserAuthenticated || !!localStorage.getItem("token");
  
  return (
    <ProductosList isUserAuthenticated={isAuthenticated} modo="usuario" />
  );
};

export default ProductoUsuarios;