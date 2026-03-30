'use client';

import clsx from 'clsx';

interface LoadingSpinnerProps {
    label?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-[3px]'
};

export default function LoadingSpinner({
    label = 'Loading...',
    className,
    size = 'md',
}: LoadingSpinnerProps) {
    return (
        <div className={clsx('inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400', className)}>
            <span
                className={clsx(
                    'inline-block animate-spin rounded-full border-zinc-400 border-t-transparent dark:border-zinc-500 dark:border-t-transparent',
                    sizeClasses[size]
                )}
                aria-hidden="true"
            />
            <span>{label}</span>
        </div>
    )
}