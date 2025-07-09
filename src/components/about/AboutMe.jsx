import { motion } from 'framer-motion';

export default function AboutMe() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.4 }}
            className="relative text-white overflow-hidden"
        >
            {/* Artist Bio */}
            <div className="relative z-10 px-6 py-2  pb-26 md:px-20 text-zinc-200">
                <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mt-5">
                    I’m always on the lookout for odd or forgotten images. Something with a little mystery. Once I start painting, the photo becomes a jumping-off point. The rest is intuition and whatever mood I’m in.
                </p>
            </div>
        </motion.section>
    );
}
