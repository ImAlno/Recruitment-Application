import type { IconProps } from './Icons';

export const Check = ({ size = 24, className = "", ...props }: IconProps & { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
