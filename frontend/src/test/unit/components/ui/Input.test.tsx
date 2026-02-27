/**
 * Input Component Unit Tests
 * This file tests the Input component for label rendering, value changes,
 * error state display, and complex password requirement formatting.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../../../components/ui/Input';
import { describe, it, expect, vi } from 'vitest';

describe('Input', () => {
    it('should render with label', () => {
        render(<Input label="Username" />);
        expect(screen.getByText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('should handle value changes', () => {
        const handleChange = vi.fn();
        render(<Input label="Username" onChange={handleChange} />);

        const input = screen.getByLabelText('Username');
        fireEvent.change(input, { target: { value: 'testuser' } });

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should display error message', () => {
        render(<Input label="Username" error="validation.required" />);
        expect(screen.getByText('validation.required')).toBeInTheDocument();
        expect(screen.getByLabelText('Username')).toHaveClass('border-red-500');
    });

    it('should render right element', () => {
        render(
            <Input
                label="Password"
                rightElement={<button>Show</button>}
            />
        );
        expect(screen.getByText('Show')).toBeInTheDocument();
    });

    it('should handle complex password errors', () => {
        render(
            <Input
                label="Password"
                error="PASSWORD_ERROR:validation.password.minLength,validation.password.uppercase"
            />
        );
        // Based on renderError logic: t('validation.passwordTitle') + ' ' + t('key1') + ', ' + t('key2')
        // Given our i18next mock returns the key as is:
        expect(screen.getByText(/validation.passwordTitle/)).toBeInTheDocument();
        expect(screen.getByText(/validation.password.minLength/)).toBeInTheDocument();
        expect(screen.getByText(/validation.password.uppercase/)).toBeInTheDocument();
    });
});
