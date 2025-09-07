import { useEffect } from 'react';

const MOBILE_WIDTH = 768;

export default function useScrollLockOnModalOpen(selectedArtwork, lenisRef) {
    useEffect(() => {
        const html = document.documentElement;
        const isDesktop = window.innerWidth >= MOBILE_WIDTH;

        if (selectedArtwork && isDesktop) {
            html.classList.add('overflow-hidden');
            lenisRef.current?.stop();
        } else {
            html.classList.remove('overflow-hidden');
            lenisRef.current?.start();
        }

        return () => {
            html.classList.remove('overflow-hidden');
            lenisRef.current?.start();
        };
    }, [selectedArtwork, lenisRef]);
}
