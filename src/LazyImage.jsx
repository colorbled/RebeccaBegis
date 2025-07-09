import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function LazyImage({ src, placeholder, alt, className = '', bare = false, motionProps = {} }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const img = imgRef.current;

        if (img?.complete && img?.naturalWidth !== 0) {
            // Image is already cached and loaded
            setIsLoaded(true);
        } else {
            setIsLoaded(false);
        }
    }, [src]);

    const ImageTag = bare ? motion.img : 'img';

    return (
        <div className={`relative overflow-hidden ${!bare ? className : ''}`}>
            {/* Placeholder Image */}
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
                loading={`lazy`}
                onLoad={() => setIsLoaded(true)}
                className={`relative w-full h-full object-cover transition-opacity duration-500 ease-in ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                } ${bare ? className : ''}`}
                {...motionProps}
            />
        </div>
    );
}
