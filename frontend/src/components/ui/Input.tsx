import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
    rightElement?: React.ReactNode;
}

const Input = ({
    label,
    error,
    fullWidth = true,
    className = '',
    rightElement,
    id,
    ...props
}: InputProps) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const widthStyle = fullWidth ? 'w-full' : '';

    return (
        <div className={`flex flex-col gap-1.5 ${widthStyle} ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={inputId}
                    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500' : 'border-gray-300'} ${rightElement ? 'pr-10' : ''}`}
                    {...props}
                />
                {rightElement && (
                    <div className="absolute right-0 top-0 h-10 flex items-center justify-center pr-3">
                        {rightElement}
                    </div>
                )}
            </div>
            {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
