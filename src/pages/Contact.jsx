// src/pages/Contact.jsx
import ContactForm from "../components/contact/ContactForm";
import BackToTopButton from '../BackToTopButton';
import useLenisScroll from '../useLenisScroll';
import useScrollToTop from '../useScrollToTop';
import { useEffect, useState } from 'react';

export default function Contact() {
    const lenisRef = useLenisScroll();


    const scrollToTop = useScrollToTop(lenisRef);

    return (
        <>
            <ContactForm />
            <BackToTopButton scrollToTop={scrollToTop} scrollThreshold={300} />
        </>
    );
}
