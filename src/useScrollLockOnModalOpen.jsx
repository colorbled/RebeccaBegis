// src/useScrollLockOnModalOpen.jsx
import { useEffect } from 'react';

const MOBILE_WIDTH = 768;

export default function useScrollLockOnModalOpen(selectedArtwork, isClosing, lenisRef) {
    useEffect(() => {
        const html = document.documentElement;
        const isDesktop = window.innerWidth >= MOBILE_WIDTH;

        const shouldLock = !!selectedArtwork && !isClosing;

        if (shouldLock && isDesktop) {
            html.classList.add('overflow-hidden');
            lenisRef.current?.stop();
        }

        return () => {
            html.classList.remove('overflow-hidden');
            lenisRef.current?.start();
        };
    }, [selectedArtwork, isClosing, lenisRef]);
}
