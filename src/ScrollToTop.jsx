import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { animate } from 'framer-motion';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        animate(window.scrollY, 0, {
            duration: 0.25,
            onUpdate: (latest) => {
                window.scrollTo(0, latest);
            },
            ease: 'easeInOut',
        });
    }, [pathname]);

    return null;
}
