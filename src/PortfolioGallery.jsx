import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import LazyImage from './LazyImage';

const variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

export default function PortfolioGallery({ artworkData, setSelectedId, setImageIndex }) {
    return (
        <section className="flex flex-col gap-12 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
            {artworkData.map((art, index) => (
                <GalleryItem
                    key={art.id}
                    art={art}
                    index={index}
                    onClick={() => {
                        setSelectedId(art.id);
                        setImageIndex(0);
                    }}
                />
            ))}
        </section>
    );
}

function GalleryItem({ art, index, onClick }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.15 });
    const controls = useAnimation();

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [inView, controls]);

    return (
        <motion.div
            ref={ref}
            className="group cursor-pointer flex flex-col md:flex-row items-center md:center min-h-[50vh] gap-6"
            variants={variants}
            initial="hidden"
            animate={controls}
            transition={{
                duration: 0.3,
                ease: 'easeOut',
                delay: index === 0 ? 0.3 : index * 0.05
            }}
            onClick={onClick}
        >
            <div className="w-full md:w-1/2 h-full overflow-hidden rounded-lg shadow-md">
                <LazyImage
                    src={art.image}
                    placeholder={art.placeholder}
                    alt={art.title}
                    bare
                    className="transition-transform duration-100 ease-out"
                    motionProps={{
                        whileHover: { scale: 1.08 },
                        transition: { duration: 0.4, ease: 'easeOut' },
                    }}
                />
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center md:justify-start px-4 sm:px-6 md:px-10">
                <div className="text-center md:text-left w-full max-w-md">
                    <h2 className="text-xl sm:text-2xl font-serif italic mb-2 text-left">{art.title}</h2>
                    <p className="text-zinc-500 text-sm text-left">
                        {art.medium}
                    </p>
                    <p className="text-zinc-500 text-sm text-left">
                        {art.dimensions}
                    </p>
                    <p className="text-zinc-500 text-sm text-left">
                        {art.year}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
