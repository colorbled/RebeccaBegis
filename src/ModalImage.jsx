import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ModalImage({ src, placeholder, alt = '', className = '', motionProps = {} }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef(null);

    return (
        <div
            className="relative w-full h-full bg-black"
            style={{ clipPath: 'inset(0)' }}
        >
            {/* Inner image wrapper — to apply offset without shifting modal layout */}
            <div className="absolute inset-0 w-[calc(100%+1px)] h-full">
                {/* Placeholder Image */}
                <img
                    src={placeholder}
                    alt=""
                    aria-hidden="true"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
                        isLoaded ? 'opacity-0' : 'opacity-100 blur-md'
                    }`}
                    style={{
                        transform: isLoaded ? 'scale(1)' : 'scale(1.01)',
                        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                    }}
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
                    style={{
                        willChange: 'opacity, transform',
                        transform: isLoaded ? 'scale(1)' : 'scale(1.00)',
                    }}
                    {...motionProps}
                />
            </div>
        </div>
    );
}
