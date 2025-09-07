import { motion } from 'framer-motion';

export default function ArtistStatement() {
    return (
        <section className="relative text-white pt-12 pb-6 px-6 md:px-12 overflow-hidden">
            {/* Headline */}
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <HeadingWithReflection text="Artist Statement" />
            </div>

            {/* Bio Content */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.4 }}
                className="relative z-10 text-zinc-200 max-w-3xl mx-auto -mt-8 md:-mt-12"
            >
                <BioParagraph>
                    My paintings use bold colors and expressive brushstrokes to explore my perception of the past and its connection to my present life. I scour old black-and-white photographs for interesting people, reimagining their likenesses in oil paint.
                </BioParagraph>
                <BioParagraph>
                    As I build up my paintings, I incorporate imagery drawn from both my life and imagination. My ultimate goal is to keep refining my voice as an artist and mastering my craft.
                </BioParagraph>
            </motion.div>

            {/* Subtle Grain Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none mix-blend-soft-light opacity-[0.06] grain-overlay" />
        </section>
    );
}

function HeadingWithReflection({ text }) {
    return (
        <>
            <motion.h2
                className="text-3xl md:text-5xl font-light leading-tight"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.5 }}
            >
                {text}
            </motion.h2>

            <motion.h2
                className="text-3xl md:text-5xl font-light leading-tight opacity-20 -mt-1 pointer-events-none select-none transform scale-y-[-1] blur-sm"
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 0.2, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                viewport={{ once: true, amount: 0.5 }}
            >
                {text}
            </motion.h2>
        </>
    );
}

function BioParagraph({ children }) {
    return (
        <p className="text-lg md:text-xl leading-relaxed mt-5">
            {children}
        </p>
    );
}
