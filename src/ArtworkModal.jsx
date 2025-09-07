import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalImage from './ModalImage';
import { X } from 'lucide-react';

export default function ArtworkModal({
                                         selectedArtwork,
                                         setSelectedId,
                                         imageIndex,
                                         handleNext,
                                         handlePrev,
                                         isClosing,
                                         setIsClosing,
                                         onCloseComplete
                                     }) {
    const MOBILE_WIDTH = 768;
    const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_WIDTH);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

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

    useEffect(() => {
        if (!selectedArtwork?.images?.[imageIndex]) return;
        const img = new Image();
        img.src = selectedArtwork.images[imageIndex];
        img.onload = () => setHasLoadedOnce(true);
    }, [imageIndex, selectedArtwork]);

    if (!selectedArtwork || isMobile) return null;

    return (
        <AnimatePresence>
            {!isClosing && (
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, pointerEvents: 'none' }}
                    animate={{ opacity: 1, pointerEvents: 'auto' }}
                    exit={{ opacity: 0, pointerEvents: 'none' }} // ✅ Prevents blocking gallery clicks
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
                    onClick={() => setIsClosing(true)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                        className="bg-zinc-950 text-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                        onAnimationComplete={() => {
                            if (isClosing) {
                                onCloseComplete?.();
                            }
                        }}
                    >
                        <div className="artwork-modal-images relative w-full min-h-[200px] aspect-[3/2] max-h-[65vh]">
                            <ModalImage
                                key={selectedArtwork.images[imageIndex]}
                                src={selectedArtwork.images[imageIndex]}
                                placeholder={
                                    selectedArtwork.placeholders?.[imageIndex] ||
                                    selectedArtwork.placeholder
                                }
                                alt={`${selectedArtwork.title} image ${imageIndex + 1}`}
                                className={`w-full h-full object-contain block transition-opacity duration-300 ${
                                    hasLoadedOnce ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
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
                            onClick={() => setIsClosing(true)}
                            className="absolute top-8 right-8 z-50 bg-blur text-white h-10 w-10 flex items-center justify-center !p-0 border-none group"
                            aria-label="Close modal"
                        >
                            <X
                                size={20}
                                className="transition-transform duration-200 ease-out group-hover:rotate-90"
                            />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
