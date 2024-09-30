import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();


  return (
    <div>
      <h2>Product Detail for ID: {id}</h2>
    </div>
  );
};

export default ProductDetail;
