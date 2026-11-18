import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isExternal?: boolean;
  icon?: React.ReactNode;
  showArrow?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  isExternal = false,
  icon,
  showArrow = false,
  children,
  className = '',
  ...props
}) => {
  const classNames = `editorial-btn btn-${variant} btn-${size} ${className}`.trim();

  const content = (
    <>
      {icon && <span className="btn-icon-prefix">{icon}</span>}
      <span className="btn-label">{children}</span>
      {showArrow && (
        <span className="btn-icon-suffix" aria-hidden="true">
          <ArrowUpRight size={16} />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classNames}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={classNames} {...props}>
      {content}
    </button>
  );
};
