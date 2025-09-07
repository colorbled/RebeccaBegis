import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import React, { useRef } from 'react';
import studioImage from '../../assets/studio.jpg';
import LazyImage from '../../LazyImage';

export default function StudioGallery() {
    const cardRef = useRef(null);

    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const rotateX = useTransform(mouseY, [0, 1], [15, -15]);
    const rotateY = useTransform(mouseX, [0, 1], [-15, 15]);

    const springConfig = { type: 'spring', stiffness: 150, damping: 20 };
    const resetSpring = { type: 'spring', stiffness: 120, damping: 15 };
    const sectionFade = { duration: 0.8, ease: 'easeOut' };
    const headingFade = { duration: 1, ease: 'easeOut' };

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const bounds = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - bounds.left) / bounds.width;
        const y = (e.clientY - bounds.top) / bounds.height;

        animate(mouseX, x, springConfig);
        animate(mouseY, y, springConfig);
    };

    const handleMouseLeave = () => {
        animate(mouseX, 0.5, resetSpring);
        animate(mouseY, 0.5, resetSpring);
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={sectionFade}
            viewport={{ once: true, amount: 0.4 }}
            className="text-center pb-12 px-6"
        >
            {/* Heading */}
            <div className="relative z-10">
                <motion.h2
                    className="text-3xl md:text-5xl font-light leading-tight"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={headingFade}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    Studio
                </motion.h2>

                <motion.h2
                    className="text-3xl md:text-5xl font-light leading-tight opacity-20 -mt-1 pointer-events-none select-none transform scale-y-[-1] blur-sm"
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 0.2, y: 0 }}
                    transition={{ ...headingFade, delay: 0.2 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    Studio
                </motion.h2>
            </div>

            {/* Subheading */}
            <motion.p
                className="text-xl text-zinc-400 mb-2 -mt-5 md:-mt-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={sectionFade}
                viewport={{ once: true, amount: 0.4 }}
            >
                St. Louis – Maker's District
            </motion.p>

            {/* Image Card */}
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
                transition={{ ...sectionFade, delay: 0.2 }}
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
