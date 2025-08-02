import { motion } from 'framer-motion';

export default function ResumeSection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.4 }}
            className="relative text-white overflow-hidden"
        >
            <div className="resume-data relative z-10 px-6 py-0  pb-26 md:px-20 text-zinc-200">
                <h2 className="text-center text-6xl font-serif italic tracking-tight mb-4">
                    Resume
                </h2>
                <div className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mt-5">
                    <div className="resume-category">
                        <div className="resume-label">EDUCATION</div>
                        2010 Bachelor of Fine Arts. The Evergreen State College.
                    </div>
                    <div className="resume-category">
                        <div className="resume-label">SOLO EXHIBITIONS</div>
                        2009 Coffers and Fish. Cafe Vita, Olympia, WA.
                    </div>
                    <div className="resume-category">
                        <div className="resume-label">GROUP EXHIBITIONS</div>
                        <div className="exhibition">
                            <div className="exhibition-title">2025 The Female Gaze, St. Louis, MO.
                            </div>
                            <div className="exhibition-desc">
                            </div>
                        </div>
                        <div className="exhibition">
                            <div className="exhibition-title">2024 Hit Like a Girl, St. Louis, MO.
                            </div>
                            <div className="exhibition-desc">
                            </div>
                        </div>
                        <div className="exhibition">
                            <div className="exhibition-title">2009 Inescapable Beauty, Elusive Sublime. Olympia, WA.
                            </div>
                            <div className="exhibition-desc">In The Presence Of Others. Evergreen State College,
                                Olympia, WA. <br></br>
                                7th Annual Jurried Local Art Exhibition. Tacoma Community College, WA.
                            </div>
                        </div>
                        <div className="exhibition">
                            <div className="exhibition-title">
                                2008 Fluid Exchanges: Fresh from the Studio. Downtown Olympia, WA.
                            </div>
                            <div className="exhibition-desc">
                                Boxlift Building Open Studios. Boxlift Building, Portland, OR.
                            </div>
                        </div>
                    </div>
                    <div className="resume-category">
                        <div className="resume-label">AWARDS</div>
                        2006 Outstanding Achievement in the Visual Arts. The Beaverton Arts Commission. (Oregon)
                        Jumpstart! Portfolio Award. The OSU Department of Art.
                        Silver Key. Regional Scholastic Art & Writing Awards. (Oregon)
                    </div>
                    <div className="resume-category">
                        <div className="resume-label">COLLECTED BY</div>
                        <p>Dr. John & Stephanie Holttum</p>
                        <p>John Albertson</p>
                        <p>Amy E. Rowe</p>
                        <p>Glenn Begis</p>
                    </div>

                </div>
            </div>
        </motion.section>
    );
}
