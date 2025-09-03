// components/ContactForm.tsx
import React from "react";

export default function ContactForm() {
    return (
        <section className="py-24 px-6 md:px-12 text-white text-center">
            <h2 className="text-4xl md:text-5xl font-serif italic mb-6">Contact</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto mb-10">
                Have a question or want to connect? Use the form below to send a message.
            </p>

            {/* Embedded Google Form */}
            <div className="max-w-2xl mx-auto rounded-lg shadow-lg aspect-video">
                <iframe
                    src="https://docs.google.com/forms/d/e/1FAIpQLSdfPQC4iefG7G0OPAz7UTzkp_0JvCP-IVJdcyo8QhqMwWgmAQ/viewform?embedded=true"
                    width="100%"
                    height="100%"
                    className="w-full google-form border-none"
                    loading="lazy"
                    title="Contact Form"
                >
                    Loading…

                </iframe>
            </div>
        </section>
    );
}
