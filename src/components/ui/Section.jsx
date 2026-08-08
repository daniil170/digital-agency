import React from 'react';
import './Section.css';

export const Section = ({ 
  children, 
  id, 
  className = '', 
  subtitle, 
  title, 
  description,
  badge,
  centered = false 
}) => {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="container">
        {(title || subtitle || badge) && (
          <div className={`section-header ${centered ? 'text-center' : ''}`}>
            {badge && <span className="badge badge-accent section-badge">{badge}</span>}
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
            {title && <h2 className="section-title">{title}</h2>}
            {description && <p className="section-description">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};
