import React from 'react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const widthStyle = fullWidth ? 'w-full' : '';

    const renderError = () => {
        if (!error) return null;

        // Handle complex password errors
        if (error.startsWith('PASSWORD_ERROR:')) {
            const reqCodes = error.replace('PASSWORD_ERROR:', '').split(',');
            const reqMap: Record<string, string> = {
                'min_length': 'minLength',
                'uppercase': 'uppercase',
                'lowercase': 'lowercase',
                'number': 'number',
                'special': 'special'
            };
            const translatedReqs = reqCodes.map(code => t(`validation.password.${reqMap[code] || code}`));
            return `${t('validation.passwordTitle')} ${translatedReqs.join(', ')}`;
        }

        // Handle simple translation keys or direct strings
        return t(error);
    };

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
            {error && <p className="text-xs font-medium text-red-500">{renderError()}</p>}
        </div>
    );
};

export default Input;
