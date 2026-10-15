import React from 'react';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`app-btn app-btn--${variant} app-btn--${size} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner" aria-label="Loading">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg>
        </span>
      ) : null}

      {icon && iconPosition === 'left' && !isLoading && (
        <span className="btn-icon btn-icon--left">{icon}</span>
      )}

      <span className="btn-text">{children}</span>

      {icon && iconPosition === 'right' && !isLoading && (
        <span className="btn-icon btn-icon--right">{icon}</span>
      )}
    </button>
  );
};

export default Button;
