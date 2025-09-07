import React, { useRef, useEffect } from 'react';
import portraitImage from '../../assets/portrait.jpg'; // Adjust the path if needed

export default function AboutHero() {
    const spotlightRef = useRef(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const spotlight = spotlightRef.current;

        const handleMouseMove = (e) => {
            const rect = section.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            spotlight.style.setProperty('--x', `${x}%`);
            spotlight.style.setProperty('--y', `${y}%`);
            spotlight.style.opacity = 1;
        };

        const handleMouseLeave = () => {
            spotlight.style.opacity = 0;
        };

        section.addEventListener('mousemove', handleMouseMove);
        section.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            section.removeEventListener('mousemove', handleMouseMove);
            section.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="m-6 relative border-0 border-black overflow-hidden"
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-top bg-cover scale-100 z-0"
                style={{
                    backgroundImage: `url(${portraitImage})`,
                    filter: 'grayscale(20%) contrast(1.2) saturate(1.1)',
                }}
            />

            {/* Gradient Fades */}
            <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-black to-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black to-transparent z-10" />

            {/* Spotlight Overlay */}
            <div
                ref={spotlightRef}
                className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-700 ease-out"
                style={{
                    backgroundImage: `url(${portraitImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    filter: 'saturate(1) contrast(1)',
                    maskImage:
                        'radial-gradient(circle at var(--x, 50%) var(--y, 50%), black 15%, transparent 60%)',
                    WebkitMaskImage:
                        'radial-gradient(circle at var(--x, 50%) var(--y, 50%), black 15%, transparent 60%)',
                    opacity: 0,
                }}
            />

            {/* Grain */}

            {/* Text Content */}
            <div className="image-border relative z-40  flex flex-col justify-end items-start text-white p-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">
                    {/* St. Louis–based traditional artist */}
                </h1>
                <p className="text-lg max-w-xl opacity-90">
                    {/* Rebecca Begis draws from memory, shadow, and reverie to create dreamlike works that echo the soul of her city. */ }
                </p>
            </div>
        </section>
    );
}
