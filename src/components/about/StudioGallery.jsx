import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import React, { useRef } from "react";
import studioImage from '../../assets/studio.jpg';
import LazyImage from '../../LazyImage';

export default function StudioGallery() {
    const cardRef = useRef(null);

    const mouseX = useMotionValue(0.5); // Default center
    const mouseY = useMotionValue(0.5);

    const rotateX = useTransform(mouseY, [0, 1], [15, -15]);
    const rotateY = useTransform(mouseX, [0, 1], [-15, 15]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const bounds = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - bounds.left) / bounds.width;
        const y = (e.clientY - bounds.top) / bounds.height;

        animate(mouseX, x, { type: 'spring', stiffness: 150, damping: 20 });
        animate(mouseY, y, { type: 'spring', stiffness: 150, damping: 20 });
    };

    const handleMouseLeave = () => {
        animate(mouseX, 0.5, { type: 'spring', stiffness: 120, damping: 15 });
        animate(mouseY, 0.5, { type: 'spring', stiffness: 120, damping: 15 });
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.4 }}
            className="text-center pb-12 px-6"
        >
            <motion.h2
                className="text-3xl md:text-5xl font-light leading-tight"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.5 }}
            >
                Studio
            </motion.h2>

            <motion.h2
                className="text-3xl md:text-5xl font-light leading-tight opacity-20 -mt-1 pointer-events-none select-none transform scale-y-[-1] blur-sm"
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 0.2, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                viewport={{ once: true, amount: 0.5 }}
            >
                Studio
            </motion.h2>

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.4 }}
                className="relative text-white"
            >
                <p className="text-xl text-zinc-400 mb-2 -mt-5 md:-mt-10">
                    St. Louis – Maker's District
                </p>
            </motion.section>

            <motion.div
                ref={cardRef}
                style={{
                    rotateX,
                    rotateY,
                    transformPerspective: 1000,
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                viewport={{ once: true, amount: 0.5 }}
                className="max-w-[800px] mx-auto mt-5 rounded-lg shadow-lg"
            >
                <LazyImage
                    src={studioImage}
                    alt="Studio"
                    title="Studio – Makers District"
                    aria-label="Studio"
                    className="studio-image m-auto rounded-lg shadow-lg"
                />
            </motion.div>
        </motion.section>
    );
}
