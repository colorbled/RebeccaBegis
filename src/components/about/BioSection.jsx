import { motion } from 'framer-motion';
import React from 'react';

export default function BioSection() {
    const headingClass = "text-3xl md:text-5xl font-light leading-tight";
    const paragraphClass = "max-w-3xl mx-auto text-lg md:text-xl leading-relaxed";
    const transitionEaseOut = { duration: 1, ease: 'easeOut' };

    return (
        <section className="relative text-white pt-12 pb-6 px-6 md:px-12 overflow-hidden">
            <div className="max-w-3xl mx-auto text-center relative z-10">
                {/* Main Statement */}
                <motion.h2
                    className={headingClass}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={transitionEaseOut}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    Bio
                </motion.h2>

                {/* Reflected Statement */}
                <motion.h2
                    className={`${headingClass} opacity-20 -mt-1 pointer-events-none select-none transform scale-y-[-1] blur-sm`}
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 0.2, y: 0 }}
                    transition={{ ...transitionEaseOut, delay: 0.2 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    Bio
                </motion.h2>
            </div>

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.4 }}
                className="relative text-white"
            >
                <div className="relative z-10 py-2 -mt-15 md:-mt-20 text-zinc-200">
                    {[
                        `<strong>Rebecca Begis is a traditional oil painter whose work explores the intersection of memory, emotion, and natural form.</strong> Born in Portland, Oregon in 1987, she studied fine art at The Evergreen State College, where she developed her foundational approach through experimentation, self-directed study, and close engagement with fellow artists.`,
                        `After relocating to the Midwest, Rebecca established her studio in St. Louis, Missouri, where she continues to refine her practice. Working primarily in oils, Rebecca’s paintings reflect a deep commitment to craftsmanship, intuition, and emotional honesty. Her work often draws from personal narrative and mythic symbolism, brought to life through impressionistic brushstrokes.`,
                        `In her studio, Rebecca is guided by a reverence for the slow and meditative process of oil painting. Each piece is built through layers of intention, allowing space for both evolution and surprise as the image unfolds.`
                    ].map((text, idx) => (
                        <p
                            key={idx}
                            className={`${paragraphClass} ${idx > 0 ? 'mt-5' : 'mt-10'}`}
                            dangerouslySetInnerHTML={{ __html: text }}
                        />
                    ))}
                </div>
            </motion.section>
        </section>
    );
}
