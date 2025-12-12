import { useEffect, useState, useRef } from 'react';

export type ScrollDirection = 'up' | 'down' | 'top';

/**
 * Hook to detect scroll direction with performance optimizations
 * 
 * @param threshold - Minimum scroll distance before direction change (default: 10px)
 * @returns Current scroll direction: 'up' | 'down' | 'top'
 * 
 * Usage:
 * const scrollDirection = useScrollDirection();
 * const isHeaderVisible = scrollDirection === 'up' || scrollDirection === 'top';
 */
export const useScrollDirection = (threshold = 10): ScrollDirection => {
    const [direction, setDirection] = useState<ScrollDirection>('top');
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        const updateScrollDirection = () => {
            const scrollY = window.scrollY;

            // Always show header at top
            if (scrollY < 10) {
                setDirection('top');
            } else if (Math.abs(scrollY - lastScrollY.current) < threshold) {
                // Don't update if scroll distance is below threshold
                ticking.current = false;
                return;
            } else {
                setDirection(scrollY > lastScrollY.current ? 'down' : 'up');
            }

            lastScrollY.current = scrollY > 0 ? scrollY : 0;
            ticking.current = false;
        };

        const onScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(updateScrollDirection);
                ticking.current = true;
            }
        };

        // Passive event listener for better scroll performance
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, [threshold]);

    return direction;
};
