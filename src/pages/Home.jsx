// src/pages/Home.jsx
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
    const selectedArtwork = artworkData.find((a) => a.id === selectedId);

    const {
        index: imageIndex,
        next: handleNext,
        prev: handlePrev,
        reset: resetCarousel
    } = useCarousel(selectedArtwork?.images || []);

    useScrollLockOnModalOpen(selectedArtwork, lenisRef);

    useEffect(() => {
        resetCarousel();
    }, [selectedId]);

    const scrollToTop = useScrollToTop(lenisRef);

    return (
        <>
            <HomeHero />
            <PortfolioGallery
                artworkData={artworkData}
                setSelectedId={setSelectedId}
                setImageIndex={resetCarousel}
            />
            <ArtworkModal
                selectedArtwork={selectedArtwork}
                setSelectedId={setSelectedId}
                imageIndex={imageIndex}
                handleNext={handleNext}
                handlePrev={handlePrev}
            />
            {!selectedArtwork && <BackToTopButton scrollToTop={scrollToTop} scrollThreshold={300} />}
        </>
    );
}
