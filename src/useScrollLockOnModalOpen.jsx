// src/useScrollLockOnModalOpen.jsx
import { useEffect } from 'react';

const MOBILE_WIDTH = 768;

export default function useScrollLockOnModalOpen(selectedArtwork, isClosing, lenisRef) {
    useEffect(() => {
        const html = document.documentElement;
        const isDesktop = window.innerWidth >= MOBILE_WIDTH;

        // Lock scroll only when modal is open and not closing
        if (selectedArtwork && !isClosing && isDesktop) {
            html.classList.add('overflow-hidden');
            lenisRef.current?.stop();
        } else {
            html.classList.remove('overflow-hidden');
            lenisRef.current?.start();
        }

        // Cleanup on unmount just in case
        return () => {
            html.classList.remove('overflow-hidden');
            lenisRef.current?.start();
        };
    }, [selectedArtwork, isClosing, lenisRef]);
}
