import { motion } from 'framer-motion';
import React from 'react';

export default function ResumeSection() {
    const headingFade = { duration: 1, ease: 'easeOut' };
    const sectionFade = { duration: 0.8, ease: 'easeOut' };

    return (
        <section className="relative text-white pt-12 pb-6 overflow-hidden">
            {/* Section Heading */}
            <div className="max-w-3xl mx-auto text-center relative z-10">
                <motion.h2
                    className="text-3xl md:text-5xl font-light leading-tight"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={headingFade}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    Resume
                </motion.h2>

                <motion.h2
                    className="text-3xl md:text-5xl font-light leading-tight opacity-20 -mt-1 pointer-events-none select-none transform scale-y-[-1] blur-sm"
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 0.2, y: 0 }}
                    transition={{ ...headingFade, delay: 0.2 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    Resume
                </motion.h2>
            </div>

            {/* Resume Body */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={sectionFade}
                viewport={{ once: true, amount: 0.4 }}
                className="relative z-10 px-6 py-2 -mt-5 md:-mt-10 text-zinc-200 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed"
            >
                {/* EDUCATION */}
                <ResumeGroup title="Education">
                    <ResumeItem year="2010" description="Bachelor's Degree. The Evergreen State College." />
                </ResumeGroup>

                {/* SOLO EXHIBITIONS */}
                <ResumeGroup title="Solo Exhibitions">
                    <ResumeItem year="2009" description={<em>Coffers and Fish.</em>} location="Cafe Vita, Olympia, WA." />
                </ResumeGroup>

                {/* GROUP EXHIBITIONS */}
                <ResumeGroup title="Group Exhibitions">
                    <ResumeItem year="2009" description={<em>Inescapable Beauty, Elusive Sublime.</em>} location="Olympia, WA." />
                    <ResumeItem description={<em>In The Presence Of Others.</em>} location="Evergreen State College, Olympia, WA." />
                    <ResumeItem description={<em>7th Annual Juried Local Art Exhibition.</em>} location="Tacoma Community College, WA." />
                    <ResumeItem year="2008" description={<em>Fluid Exchanges: Fresh from the Studio.</em>} location="Downtown Olympia, WA." />
                    <ResumeItem description={<em>Boxlift Building Open Studios.</em>} location="Boxlift Building, Portland, OR." />
                    <ResumeItem year="2024" description={<em>Hit Like a Girl.</em>} location="St. Louis Lady's Art Guild. The Crack Fox, St. Louis, MO." />
                    <ResumeItem year="2025" description={<em>The Female Gaze.</em>} location="St. Louis Lady's Art Guild. Artisans in The LOOP, University City, MO." />
                    <ResumeItem description={<em>Legends and Lore.</em>} location="Artisans in The LOOP, University City, MO." />
                    <ResumeItem description={<em>After the Storm.</em>} location="MADE Makerspace, St. Louis, MO." />
                </ResumeGroup>

                {/* AWARDS */}
                <ResumeGroup title="Awards">
                    <ResumeItem year="2006" description={<em>Outstanding Achievement in the Visual Arts.</em>} location="The Beaverton Arts Commission. (Oregon)" />
                    <ResumeItem description={<em>Jumpstart! Portfolio Award.</em>} location="The OSU Department of Art." />
                    <ResumeItem description={<em>Silver Key.</em>} location="Regional Scholastic Art & Writing Awards. (Oregon)" />
                </ResumeGroup>

                {/* COLLECTED BY */}
                <ResumeGroup title="Collected By">
                    <p className="mt-1">Dr. John &amp; Stephanie Holttum</p>
                    <p>John Albertson</p>
                    <p>Amy E. Rowe</p>
                    <p>Glenn Begis</p>
                </ResumeGroup>
            </motion.div>
        </section>
    );
}

// Group Heading Wrapper
function ResumeGroup({ title, children }) {
    return (
        <div className="mb-8">
            <div className="font-bold uppercase tracking-wider text-white">{title}</div>
            {children}
        </div>
    );
}

// Entry Item
function ResumeItem({ year, description, location }) {
    return (
        <div className="flex gap-4 mt-1">
            <div className="w-16 shrink-0">{year || ''}</div>
            <div>
                {description}
                {location && <span> {location}</span>}
            </div>
        </div>
    );
}
