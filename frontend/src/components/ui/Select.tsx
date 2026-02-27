import React from 'react';

/**
 * Props for the Select component.
 */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    /** Optional label text to display above the select dropdown. */
    label?: string;
    /** Array of option objects with labels and values. */
    options: { label: string; value: string }[];
    /** Optional error message to display below the select. */
    error?: string;
    /** If true, the select container takes up the full width. Defaults to true. */
    fullWidth?: boolean;
}

/**
 * Standardized Select (dropdown) component with optional label and error messaging.
 * 
 * @param {SelectProps} props - The component props.
 * @returns {JSX.Element} The rendered select container.
 */
const Select = ({
    label,
    options,
    error,
    fullWidth = true,
    className = '',
    id,
    ...props
}: SelectProps) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const widthStyle = fullWidth ? 'w-full' : '';

    return (
        <div className={`flex flex-col gap-1.5 ${widthStyle} ${className}`}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="text-sm font-medium leading-none text-gray-700"
                >
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
};

export default Select;
