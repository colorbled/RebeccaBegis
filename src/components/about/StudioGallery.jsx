import { motion } from 'framer-motion';
import studioImage from '../../assets/studio.jpg';
import LazyImage from '../../LazyImage';

export default function StudioGallery() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.4 }}
            className="text-center pb-12"
        >
            <h1 className="text-6xl font-serif italic tracking-tight mb-4">
                Studio
            </h1>
            <p className="text-xl text-zinc-400 mb-2">
                St. Louis – Maker's District
            </p>

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                viewport={{ once: true, amount: 0.5 }}
                className="max-w-[800px] mx-auto mt-5"
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
