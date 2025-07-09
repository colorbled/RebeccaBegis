import { useEffect } from 'react';

export default function useScrollLockOnModalOpen(selectedArtwork, lenisRef) {
    useEffect(() => {
        const html = document.documentElement;
        if (selectedArtwork) {
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
