import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimatedListProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}

interface AnimatedItemProps {
    children: ReactNode;
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
