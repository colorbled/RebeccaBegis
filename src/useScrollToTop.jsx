// useScrollToTop.js
export default function useScrollToTop(lenisRef) {
    return () => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, {
                offset: 0,
                immediate: false,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
        }
    };
}
