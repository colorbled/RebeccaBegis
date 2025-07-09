import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LazyImage({ src, placeholder, alt, className = '', bare = false, motionProps = {} }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef(null);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.01, // triggers with even 1% visibility
                rootMargin: '100px' // load slightly before it's visible
            }
        );

        const current = containerRef.current;
        if (current) observer.observe(current);

        return () => observer.disconnect();
    }, []);

    const ImageTag = bare ? motion.img : 'img';

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden min-h-[200px] ${!bare ? className : ''}`}
            style={{ minHeight: '200px' }} // fallback in case Tailwind fails
        >
            {isInView && (
                <>
                    {/* Placeholder */}
                    <img
                        src={placeholder}
                        alt={`${alt} placeholder`}
                        aria-hidden="true"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
                            isLoaded ? 'opacity-0' : 'opacity-100 blur-md scale-105'
                        }`}
                    />

                    {/* Full-res Image */}
                    <ImageTag
                        ref={imgRef}
                        src={src}
                        alt={alt}
                        loading="lazy"
                        onLoad={() => setIsLoaded(true)}
                        className={`relative w-full h-full object-cover transition-opacity duration-500 ease-in ${
                            isLoaded ? 'opacity-100' : 'opacity-0'
                        } ${bare ? className : ''}`}
                        {...motionProps}
                    />
                </>
            )}
        </div>
    );
}
