import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from './LazyImage';

export default function ArtworkModal({
                                         selectedArtwork,
                                         setSelectedId,
                                         imageIndex,
                                         handleNext,
                                         handlePrev
                                     }) {
    const MOBILE_WIDTH = 768;
    const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_WIDTH);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

    // Detect window resize and auto-close modal if resizing into mobile
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < MOBILE_WIDTH;
            setIsMobile(mobile);

            if (mobile && selectedArtwork) {
                setSelectedId(null);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [selectedArtwork, setSelectedId]);

    // Preload image
    useEffect(() => {
        if (!selectedArtwork?.images?.[imageIndex]) return;

        const img = new Image();
        img.src = selectedArtwork.images[imageIndex];
        img.onload = () => setHasLoadedOnce(true);
    }, [imageIndex, selectedArtwork]);

    // Do not render modal on mobile
    if (!selectedArtwork || isMobile) return null;

    return (
        <AnimatePresence>
            <motion.div
                key="modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
                onClick={() => setSelectedId(null)}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                    className="bg-zinc-950 text-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl p-6 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="artwork-modal-images relative w-full min-h-[200px] aspect-[3/2] max-h-[65vh]">
                        <LazyImage
                            key={selectedArtwork.images[imageIndex]}
                            src={selectedArtwork.images[imageIndex]}
                            placeholder={
                                selectedArtwork.placeholders?.[imageIndex] ||
                                selectedArtwork.placeholder
                            }
                            alt={`${selectedArtwork.title} image ${imageIndex + 1}`}
                            className={`w-full h-full object-contain transition-opacity duration-300 ${hasLoadedOnce ? 'opacity-100' : 'opacity-0'}`}
                        />
                        {/* Optional nav buttons */}
                        {/*
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-zinc-800 hover:bg-zinc-700 p-3 rounded-full shadow-lg"
                        >
                            ‹
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-zinc-800 hover:bg-zinc-700 p-3 rounded-full shadow-lg"
                        >
                            ›
                        </button>
                        */}
                    </div>

                    <div className="mt-6 text-center">
                        <h3 className="text-2xl font-serif italic mb-2 tracking-tight">
                            {selectedArtwork.title}
                        </h3>
                        <p className="text-zinc-400 text-sm">
                            {selectedArtwork.medium} – {selectedArtwork.dimensions} – {selectedArtwork.year}
                        </p>
                    </div>

                    <button
                        onClick={() => setSelectedId(null)}
                        className="absolute top-4 right-4 text-zinc-400 hover:text-white text-2xl font-light"
                    >
                        ✕
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}