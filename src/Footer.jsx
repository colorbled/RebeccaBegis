// src/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="border-t border-zinc-800 px-4 py-12 sm:px-6 md:px-8 text-zinc-400 text-sm bg-black">
            <div className="max-w-5xl mx-auto grid gap-10 sm:grid-cols-3">
                {/* Explore */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-white font-semibold mb-2">Explore</h3>
                    <Link to="/" className="hover:text-white transition">Home</Link>
                    <Link to="/about" className="hover:text-white transition">About</Link>
                    <Link to="/contact" className="hover:text-white transition">Contact</Link>
                </div>

                {/* Connect */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-white font-semibold mb-2">Connect</h3>
                    <a href="mailto:rebeccabegis@gmail.com" className="hover:text-white transition">Email</a>
                    <a href="https://instagram.com/rebeccabegis" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Instagram</a>
                </div>

                {/* Studio */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-white font-semibold mb-2">Studio</h3>
                    <p>Based in St. Louis, Missouri</p>
                    <p>Maker's District</p>
                </div>
            </div>

            <div className="text-center mt-12 text-zinc-600 text-xs">
                © {new Date().getFullYear()} Rebecca Begis. All rights reserved.
            </div>
        </footer>
    );
}
