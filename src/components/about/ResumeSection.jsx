import { motion } from 'framer-motion';
import React from "react";

export default function ResumeSection() {
    return (
        <section className="relative text-white pt-12 pb-6 overflow-hidden">
            <div className="max-w-3xl mx-auto text-center relative z-10">
                <motion.h2
                    className="text-3xl md:text-5xl font-light leading-tight"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    Resume
                </motion.h2>
                <motion.h2
                    className="text-3xl md:text-5xl font-light leading-tight opacity-20 -mt-1 pointer-events-none select-none transform scale-y-[-1] blur-sm"
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 0.2, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    Resume
                </motion.h2>
            </div>

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.4 }}
                className="relative text-white"
            >
                <div className="relative z-10 px-6 py-2 -mt-5 md:-mt-10 pb-26 md:px-6 text-zinc-200 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">

                    {/* EDUCATION */}
                    <div className="mb-8">
                        <div className="font-bold uppercase tracking-wider text-white">Education</div>
                        <div className="flex gap-4 mt-1">
                            <div className="w-16 shrink-0">2010</div>
                            <div>Bachelor of Fine Arts. The Evergreen State College.</div>
                        </div>
                    </div>

                    {/* SOLO EXHIBITIONS */}
                    <div className="mb-8">
                        <div className="font-bold uppercase tracking-wider text-white">Solo Exhibitions</div>
                        <div className="flex gap-4 mt-1">
                            <div className="w-16 shrink-0">2009</div>
                            <div><em>Coffers and Fish.</em> Cafe Vita, Olympia, WA.</div>
                        </div>
                    </div>

                    {/* GROUP EXHIBITIONS */}
                    <div className="mb-8">
                        <div className="font-bold uppercase tracking-wider text-white">Group Exhibitions</div>

                        <div className="flex gap-4 mt-1">
                            <div className="w-16 shrink-0">2009</div>
                            <div><em>Inescapable Beauty, Elusive Sublime.</em> Olympia, WA.</div>
                        </div>
                        <div className="flex gap-4 mt-1">
                            <div className="w-16 shrink-0"></div>
                            <div><em>In The Presence Of Others.</em> Evergreen State College, Olympia, WA.</div>
                        </div>
                        <div className="flex gap-4 mt-1">
                            <div className="w-16 shrink-0"></div>
                            <div><em>7th Annual Juried Local Art Exhibition.</em> Tacoma Community College, WA.</div>
                        </div>

                        <div className="flex gap-4 mt-2">
                            <div className="w-16 shrink-0">2008</div>
                            <div><em>Fluid Exchanges: Fresh from the Studio.</em> Downtown Olympia, WA.</div>
                        </div>
                        <div className="flex gap-4 mt-1">
                            <div className="w-16 shrink-0"></div>
                            <div><em>Boxlift Building Open Studios.</em> Boxlift Building, Portland, OR.</div>
                        </div>
                    </div>

                    {/* AWARDS */}
                    <div className="mb-8">
                        <div className="font-bold uppercase tracking-wider text-white">Awards</div>

                        <div className="flex gap-4 mt-1">
                            <div className="w-16 shrink-0">2006</div>
                            <div><em>Outstanding Achievement in the Visual Arts.</em> The Beaverton Arts Commission. (Oregon)</div>
                        </div>
                        <div className="flex gap-4 mt-1">
                            <div className="w-16 shrink-0"></div>
                            <div><em>Jumpstart! Portfolio Award.</em> The OSU Department of Art.</div>
                        </div>
                        <div className="flex gap-4 mt-1">
                            <div className="w-16 shrink-0"></div>
                            <div><em>Silver Key.</em> Regional Scholastic Art & Writing Awards. (Oregon)</div>
                        </div>
                    </div>

                    {/* COLLECTED BY */}
                    <div className="mb-4">
                        <div className="font-bold uppercase tracking-wider text-white">Collected By</div>
                        <p className="mt-1">Dr. John &amp; Stephanie Holttum</p>
                        <p>John Albertson</p>
                        <p>Amy E. Rowe</p>
                        <p>Glenn Begis</p>
                    </div>

                </div>
            </motion.section>
        </section>
    );
}
