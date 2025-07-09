import { motion } from 'framer-motion';

export default function AboutMe() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.4 }}
            className="relative text-white "
        >
            {/* Artist Bio */}
            <div className="relative z-10 px-6 py-2 -mt-20 pb-26 md:px-20 text-zinc-200">
                <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mt-5">
                    My paintings use bold colors and expressive brushstrokes to explore my perception of the past and
                    its connection to my present life.
                    I scour old black-and-white photographs for interesting people, reimagining their likenesses in oil
                    paint.
                </p>
                <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mt-5">
                    As I build up my paintings, I incorporate imagery drawn from both my life and imagination. My ultimate goal is to keep refining my voice as an artist and mastering my craft.                </p>
            </div>
        </motion.section>
    );
}
