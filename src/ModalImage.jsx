import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ModalImage({ src, placeholder, alt = '', className = '', motionProps = {} }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef(null);

    return (
        <div className={`relative overflow-hidden w-full h-full`}>
            {/* Placeholder Image */}
            <img
                src={placeholder}
                alt=""
                aria-hidden="true"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
                    isLoaded ? 'opacity-0' : 'opacity-100 blur-md scale-105'
                }`}
            />

            {/* Full-resolution Image */}
            <motion.img
                ref={imgRef}
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                } ${className}`}
                {...motionProps}
            />
        </div>
    );
}
