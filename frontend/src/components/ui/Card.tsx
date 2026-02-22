import React from 'react';

/**
 * Props for the Card components.
 */
interface CardProps {
    /** Content to be rendered inside the card section. */
    children: React.ReactNode;
    /** Optional additional CSS classes. */
    className?: string;
}

/**
 * Main Card container component with a border, background, and shadow.
 * 
 * @param {CardProps} props - The component props.
 * @returns {JSX.Element} The rendered card.
 */
const Card = ({ children, className = '' }: CardProps) => {
    return (
        <div className={`rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm ${className}`}>
            {children}
        </div>
    );
};

/**
 * Card header section, typically containing the title and description.
 */
export const CardHeader = ({ children, className = '' }: CardProps) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

/**
 * Card title component with specific typography.
 */
export const CardTitle = ({ children, className = '' }: CardProps) => (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

/**
 * Card description text component.
 */
export const CardDescription = ({ children, className = '' }: CardProps) => (
    <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);

/**
 * Card content section for the main body of the card.
 */
export const CardContent = ({ children, className = '' }: CardProps) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

/**
 * Card footer section for actions or meta-information.
 */
export const CardFooter = ({ children, className = '' }: CardProps) => (
    <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>
);

export default Card;
