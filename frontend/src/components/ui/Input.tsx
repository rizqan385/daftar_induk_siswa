import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {label && (
                <label htmlFor={inputId} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                    {label}
                </label>
            )}
            <input
                id={inputId}
                {...props}
                style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: error ? '1px solid var(--danger-color, #ef4444)' : '1px solid var(--border-color)',
                    background: '#ffffff',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    width: '100%',
                    boxSizing: 'border-box',
                    ...props.style
                }}
                className={`custom-input ${className}`}
            />
            {error && (
                <span style={{ color: 'var(--danger-color, #ef4444)', fontSize: '0.8rem' }}>{error}</span>
            )}
        </div>
    );
};

export default Input;
