import { useEffect } from 'react';

/**
 * Locks the #admin-main scroll container (and body) while a modal/panel is open.
 * Restores on unmount automatically.
 */
export function useScrollLock() {
    useEffect(() => {
        // Lock body
        const prevBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // Lock the main scroll container
        const main = document.getElementById('admin-main');
        const prevMainOverflow = main?.style.overflow ?? '';
        if (main) main.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = prevBodyOverflow;
            if (main) main.style.overflow = prevMainOverflow || 'auto';
        };
    }, []);
}
