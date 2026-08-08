import React from 'react';
import './Card.css';

export const Card = ({ children, className = '', hoverable = true, onClick, ...props }) => {
  return (
    <div 
      className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
