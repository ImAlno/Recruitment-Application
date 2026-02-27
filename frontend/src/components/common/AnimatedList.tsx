import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Props for the AnimatedList component.
 */
interface AnimatedListProps {
    /** The content items to be animated as children. */
    children: ReactNode;
    /** Optional additional CSS classes for the container. */
    className?: string;
    /** Delay in seconds between each child's entry animation. Defaults to 0.05. */
    staggerDelay?: number;
}

/**
 * Props for the AnimatedItem component.
 */
interface AnimatedItemProps {
    /** The content to be animated. */
    children: ReactNode;
    /** Optional additional CSS classes. */
    className?: string;
}

const itemVariants: Variants = {
    initial: {
        opacity: 0,
        y: 15,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};

/**
 * Component that wraps a list of items and applies a staggered entry animation to its children.
 * Works in conjunction with AnimatedItem.
 * 
 * @param {AnimatedListProps} props - The component props.
 * @returns {JSX.Element} The rendered animated container.
 */
export const AnimatedList = ({ children, className = '', staggerDelay = 0.05 }: AnimatedListProps) => {
    return (
        <motion.div
            variants={{
                animate: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            initial="initial"
            animate="animate"
            className={className}
        >
            {children}
        </motion.div>
    );
};

/**
 * Component that wraps an individual list item and defines its entry animation.
 * Should be used as a child of AnimatedList.
 * 
 * @param {AnimatedItemProps} props - The component props.
 * @returns {JSX.Element} The rendered animated item.
 */
export const AnimatedItem = ({ children, className = '' }: AnimatedItemProps) => {
    return (
        <motion.div
            variants={itemVariants}
            className={className}
        >
            {children}
        </motion.div>
    );
};
