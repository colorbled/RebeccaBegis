// src/App.jsx
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import ScrollToTop from './ScrollToTop';
import Header from './Header';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './Footer';

function AppRoutes() {
    const location = useLocation();

    return (
        <Layout location={location}>
            <ScrollToTop />
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
    );
}

export default function App() {
    return (
        <Router>
            <Header />
            <AppRoutes />
            <Footer />
        </Router>
    );
}
