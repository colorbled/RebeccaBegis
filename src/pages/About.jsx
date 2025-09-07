// src/pages/About.jsx
import AboutHero from '../components/about/AboutHero';
import BioSection from "../components/about/BioSection";
import ResumeSection from "../components/about/ResumeSection.jsx";
import AboutMe from "../components/about/AboutMe";
import ArtistStatement from "../components/about/ArtistStatement";
import StudioGallery from "../components/about/StudioGallery";
import BackToTopButton from '../BackToTopButton';
import useLenisScroll from '../useLenisScroll';
import useScrollToTop from '../useScrollToTop';
import { useEffect, useState } from 'react';

export default function About() {
    const lenisRef = useLenisScroll();


    const scrollToTop = useScrollToTop(lenisRef);

    return (
        <>
            <AboutHero />
            <BioSection />
            <ArtistStatement />
            <AboutMe />
            <ResumeSection />
            <StudioGallery />
            <BackToTopButton scrollToTop={scrollToTop} scrollThreshold={300} />
        </>
    );
}
