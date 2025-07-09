// useCarousel.js
import { useState } from 'react';

export default function useCarousel(images = []) {
    const [index, setIndex] = useState(0);

    const next = () => {
        if (images.length > 0) {
            setIndex((index + 1) % images.length);
        }
    };

    const prev = () => {
        if (images.length > 0) {
            setIndex((index - 1 + images.length) % images.length);
        }
    };

    const reset = () => setIndex(0);

    return { index, next, prev, reset };
}