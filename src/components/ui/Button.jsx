import React from 'react';
import './Button.css';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  href, 
  type = 'button',
  className = '',
  icon: Icon = null,
  ...props 
}) => {
  const baseClass = `btn btn-${variant} btn-${size} ${className}`;

  if (href) {
    return (
      <a href={href} className={baseClass} {...props}>
        {children}
        {Icon && <Icon className="btn-icon" size={18} />}
      </a>
    );
  }

  return (
    <button type={type} className={baseClass} onClick={onClick} {...props}>
      {children}
      {Icon && <Icon className="btn-icon" size={18} />}
    </button>
  );
};
