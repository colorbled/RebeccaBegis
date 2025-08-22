import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import logo from './assets/rb-logo.png';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    const linkBaseStyle = "hover:text-white transition-colors";
    const activeStyle = "text-white";
    const inactiveStyle = "text-zinc-400";

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/contact", label: "Contact" },
    ];

    function GooglyEye() {
        const eyeRef = useRef(null);
        const [target, setTarget] = useState({ x: 7, y: 7 });
        const [pupil, setPupil] = useState({ x: 0, y: 0 });

        // Track mouse position and update the *target* pupil position
        useEffect(() => {
            const handleMouseMove = (e) => {
                const eye = eyeRef.current;
                if (!eye) return;

                const rect = eye.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const dx = e.clientX - centerX;
                const dy = e.clientY - centerY;
                const maxDist = 10;
                const dist = Math.min(Math.hypot(dx, dy), maxDist);
                const angle = Math.atan2(dy, dx);

                setTarget({
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                });
            };

            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }, []);

        // Animate the pupil toward the target
        useEffect(() => {
            let animationFrame;
            const animate = () => {
                setPupil((prev) => {
                    const ease = 0.15; // lower = slower easing
                    return {
                        x: prev.x + (target.x - prev.x) * ease,
                        y: prev.y + (target.y - prev.y) * ease,
                    };
                });
                animationFrame = requestAnimationFrame(animate);
            };
            animate();
            return () => cancelAnimationFrame(animationFrame);
        }, [target]);

        return (
            <svg
                ref={eyeRef}
                width="48"
                height="48"
                viewBox="0 0 48 48"
                className="cursor-pointer"
            >
                <circle cx="24" cy="24" r="22" fill="white" stroke="black" strokeWidth="2"/>
                <circle
                    cx={24 + pupil.x}
                    cy={24 + pupil.y}
                    r="9"
                    fill="black"
                />
            </svg>
        );
    }

    return (
        <header className="p-6 border-b border-zinc-800 z-1000">
            <div className="flex justify-between items-center">
                {/* Logo */}
                <div className="site-logo">
                    <Link to="/">
                        <GooglyEye/>
                        <GooglyEye/>
                    </Link>
                </div>

                {/* Desktop nav */}
                <nav
                    className="hidden md:flex gap-8 text-sm items-center font-serif tracking-wide uppercase text-[15px]">
                    {navLinks.map(({to, label}) => (
                        <Link
                            key={to}
                            to={to}
                            className={`${linkBaseStyle} ${pathname === to ? activeStyle : inactiveStyle}`}
                        >
                            {label}
                        </Link>
                    ))}
                    <a
                        href="https://www.instagram.com/rebeccabegis/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${linkBaseStyle} ${inactiveStyle}`}
                    >
                        <Instagram className="w-5 h-5"/>
                    </a>
                </nav>

                {/* Mobile menu toggle */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-white focus:outline-none"
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                >
                    {isOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                </button>
            </div>

            {/* Mobile nav menu */}
            {isOpen && (
                <nav
                    className="flex flex-col gap-4 mt-4 md:hidden text-sm font-serif tracking-wide uppercase text-[15px]">
                    {navLinks.map(({to, label}) => (
                        <Link
                            key={to}
                            to={to}
                            className={`${linkBaseStyle} ${pathname === to ? activeStyle : inactiveStyle}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}
                    <a
                        href="https://www.instagram.com/rebeccabegis/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${linkBaseStyle} ${inactiveStyle} flex items-center gap-1`}
                    >
                        <Instagram className="w-5 h-5"/> Instagram
                    </a>
                </nav>
            )}
        </header>
    );
}
