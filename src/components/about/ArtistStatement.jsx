import React from 'react';
import { motion } from 'framer-motion';

export default function ArtistStatement() {
    return (
        <section className="relative text-white py-24 px-6 md:px-12 overflow-hidden">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                {/* Main Statement with animation */}
                <motion.h2
                    className="text-3xl md:text-5xl font-light leading-tight"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    I begin with old photographs. Where it ends depends on the day.


                </motion.h2>

                {/* Reflected Statement with animation */}
                <motion.h2
                    className="text-3xl md:text-5xl font-light leading-tight opacity-20 mt-2 pointer-events-none select-none transform scale-y-[-1] blur-sm"
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 0.2, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    I begin with old photographs. Where it ends depends on the day.


                </motion.h2>
            </div>

            {/* Grain Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none mix-blend-soft-light opacity-[0.06] grain-overlay" />
        </section>
    );
}
