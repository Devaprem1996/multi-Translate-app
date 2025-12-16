// src/components/Common/Button.jsx
import React from 'react';

export function Button({
    children,
    variant = 'primary', // primary, secondary, outline, ghost, danger
    size = 'medium', // small, medium, large
    icon,
    iconPosition = 'left',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    className = '',
    ...props
}) {
    const baseClass = 'btn';

    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        ghost: 'btn-ghost',
        danger: 'btn-danger'
    };

    const sizeClasses = {
        small: 'btn-sm',
        medium: 'btn-md',
        large: 'btn-lg'
    };

    const classes = [
        baseClass,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'btn-full',
        isLoading && 'btn-loading',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <span className="btn-spinner">
                    <svg viewBox="0 0 24 24" fill="none">
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray="32"
                            strokeLinecap="round"
                        />
                    </svg>
                </span>
            )}

            {!isLoading && icon && iconPosition === 'left' && (
                <span className="btn-icon">{icon}</span>
            )}

            <span className="btn-text">{children}</span>

            {!isLoading && icon && iconPosition === 'right' && (
                <span className="btn-icon">{icon}</span>
            )}
        </button>
    );
}

// Icon Button Variant
export function IconButton({
    icon,
    label,
    variant = 'ghost',
    size = 'medium',
    ...props
}) {
    const sizeMap = {
        small: 32,
        medium: 40,
        large: 48
    };

    return (
        <button
            className={`icon-btn icon-btn-${variant} icon-btn-${size}`}
            aria-label={label}
            title={label}
            style={{ width: sizeMap[size], height: sizeMap[size] }}
            {...props}
        >
            {icon}
        </button>
    );
}