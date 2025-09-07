import HomeHero from '../HomeHero';
import PortfolioGallery from '../PortfolioGallery';
import ArtworkModal from '../ArtworkModal';
import BackToTopButton from '../BackToTopButton';
import artworkData from '../artworkData';
import useLenisScroll from '../useLenisScroll';
import useScrollLockOnModalOpen from '../useScrollLockOnModalOpen';
import useCarousel from '../useCarousel';
import useScrollToTop from '../useScrollToTop';
import { useEffect, useState } from 'react';

export default function Home() {
    const lenisRef = useLenisScroll();
    const [selectedId, setSelectedId] = useState(null);
    const [isClosing, setIsClosing] = useState(false);

    const selectedArtwork = artworkData.find((a) => a.id === selectedId);

    const {
        index: imageIndex,
        next: handleNext,
        prev: handlePrev,
        reset: resetCarousel
    } = useCarousel(selectedArtwork?.images || []);

    const scrollToTop = useScrollToTop(lenisRef);

    // Scroll lock logic
    useScrollLockOnModalOpen(selectedArtwork, isClosing, lenisRef);

    // Reset carousel whenever artwork changes
    useEffect(() => {
        resetCarousel();
    }, [selectedId]);

    return (
        <>
            <HomeHero />
            <PortfolioGallery
                artworkData={artworkData}
                setSelectedId={(id) => {
                    setIsClosing(false); // Always reset closing
                    setSelectedId(id);  // Open modal
                }}
                setImageIndex={resetCarousel}
            />
            <ArtworkModal
                selectedArtwork={selectedArtwork}
                setSelectedId={setSelectedId}
                imageIndex={imageIndex}
                handleNext={handleNext}
                handlePrev={handlePrev}
                isClosing={isClosing}
                setIsClosing={setIsClosing}
                onCloseComplete={() => {
                    // 🔧 Called after modal fully closes
                    setIsClosing(false);
                    setSelectedId(null);
                }}
            />
            {!selectedArtwork && (
                <BackToTopButton scrollToTop={scrollToTop} scrollThreshold={300} />
            )}
        </>
    );
}
