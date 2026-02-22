import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

/**
 * Props for the Button component.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Visual style variant of the button. Defaults to 'primary'. */
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    /** Size of the button. Defaults to 'md'. */
    size?: 'sm' | 'md' | 'lg';
    /** If true, the button will take up the full width of its container. */
    fullWidth?: boolean;
}

/**
 * A versatile, animated Button component using framer-motion.
 * Supports multiple variants, sizes, and a full-width mode.
 * 
 * @param {ButtonProps} props - The component props.
 * @returns {JSX.Element} The rendered button.
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 shadow-sm';

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-8 text-base',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    // Cast to motion component props to avoid type conflicts with standard button props
    const motionProps = props as HTMLMotionProps<'button'>;

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
            {...motionProps}
        >
            {children}
        </motion.button>
    );
};

export default Button;
