/**
 * Button Component Unit Tests
 * This file tests the Button component for correct rendering, click handling,
 * and styling variants (primary, danger, etc.).
 */
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../../../components/ui/Button';
import { describe, it, expect, vi } from 'vitest';

describe('Button', () => {
    it('should render correctly with children', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should handle click events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        fireEvent.click(screen.getByText('Click me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
        render(<Button disabled>Click me</Button>);
        expect(screen.getByText('Click me')).toBeDisabled();
    });

    it('should apply variant classes', () => {
        const { rerender } = render(<Button variant="primary">Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

        rerender(<Button variant="danger">Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-red-600');
    });

    it('should apply size classes', () => {
        const { rerender } = render(<Button size="sm">Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('h-8');

        rerender(<Button size="lg">Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('h-12');
    });

    it('should apply fullWidth class', () => {
        render(<Button fullWidth>Button</Button>);
        expect(screen.getByRole('button')).toHaveClass('w-full');
    });
});
