// src/Layout.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function Layout({ children }) {
    const location = useLocation();
    const hasMounted = useRef(false);
    const [initialRenderDone, setInitialRenderDone] = useState(false);

    useEffect(() => {
        // Mark that the first render is complete after mount
        hasMounted.current = true;
        setInitialRenderDone(true);
    }, []);

    const transition = { duration: 0.4, ease: 'easeInOut' };

    // Animate on first load
    if (!initialRenderDone) {
        return (
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transition}
                className="main-wrapper min-h-screen text-white font-serif overflow-hidden pb-16"
            >
                {children}
            </motion.main>
        );
    }

    // Animate on route change
    return (
        <div className="main-wrapper min-h-screen text-white font-serif pb-16">
            <AnimatePresence mode="wait">
                <motion.main
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={transition}
                    className="overflow-hidden"
                >
                    {children}
                </motion.main>
            </AnimatePresence>
        </div>
    );
}
