import React from 'react';
import './Card.css';

export const Card = ({
  children,
  variant = 'default',
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`app-card app-card--${variant} ${hoverable ? 'app-card--hoverable' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
