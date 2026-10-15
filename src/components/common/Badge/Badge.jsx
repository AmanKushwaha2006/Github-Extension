import React from 'react';
import './Badge.css';

export const Badge = ({
  children,
  variant = 'teal',
  dot = false,
  className = ''
}) => {
  return (
    <span className={`app-badge app-badge--${variant} ${className}`}>
      {dot && <span className="app-badge__dot" />}
      <span className="app-badge__text">{children}</span>
    </span>
  );
};

export default Badge;
