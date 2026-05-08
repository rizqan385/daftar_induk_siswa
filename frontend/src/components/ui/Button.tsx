import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    className = '',
    style,
    ...props 
}) => {
    
    let background = 'var(--accent)';
    let color = 'white';
    let borderColor = 'transparent';

    if (variant === 'secondary') {
        background = 'rgba(59, 130, 246, 0.1)';
        color = '#60a5fa';
        borderColor = 'rgba(59, 130, 246, 0.2)';
    } else if (variant === 'danger') {
        background = 'var(--danger-color, #ef4444)';
        color = 'white';
    } else if (variant === 'ghost') {
        background = 'transparent';
        color = 'var(--text-secondary)';
    }

    const padding = size === 'sm' ? '6px 12px' : size === 'lg' ? '14px 24px' : '10px 16px';
    const fontSize = size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem';

    return (
        <button
            {...props}
            style={{
                background,
                color,
                border: `1px solid ${borderColor}`,
                padding,
                fontSize,
                fontWeight: 600,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: fullWidth ? '100%' : 'auto',
                opacity: props.disabled ? 0.7 : 1,
                ...style
            }}
            className={`btn-${variant} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
