export const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};
export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};
export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
};
export const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 }
};
export const slideInRight = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
};
export const transition = {
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1]
};
