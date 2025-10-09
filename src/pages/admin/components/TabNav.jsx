import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export default function TabNav({ value, onChange, tabs }) {
    const listRef = useRef(null);
    const activeIndex = Math.max(0, tabs.findIndex(t => t.value === value));

    return (
        <div className="w-full">
            <div
                ref={listRef}
                role="tablist"
                aria-label="Sections"
                className="relative flex items-center gap-2"
            >
                {tabs.map((t, i) => {
                    const active = value === t.value;
                    return (
                        <button
                            key={t.value}
                            role="tab"
                            aria-selected={active}
                            tabIndex={active ? 0 : -1}
                            onClick={() => onChange(t.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'ArrowRight') onChange(tabs[(i + 1) % tabs.length].value);
                                if (e.key === 'ArrowLeft') onChange(tabs[(i - 1 + tabs.length) % tabs.length].value);
                            }}
                            className={[
                                "relative -mb-px px-2 sm:px-3 py-2 text-sm font-medium",
                                "border-b-2 border-transparent",
                                active
                                    ? "text-white"
                                    : "text-zinc-400 hover:text-white/90",
                            ].join(" ")}
                        >
              <span className="flex items-center gap-2">
                {t.icon ? <t.icon className="h-4 w-4" /> : null}
                  {t.label}
                  {typeof t.count === 'number' && (
                      <span className="ml-1 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-zinc-300">
                    {t.count}
                  </span>
                  )}
              </span>
                        </button>
                    );
                })}

                {/* Animated underline */}
                <motion.div
                    layout
                    className="absolute bottom-0 h-0.5 bg-white/80"
                    style={{
                        left: underlineLeft(listRef, activeIndex),
                        width: underlineWidth(listRef, activeIndex),
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
            </div>
        </div>
    );
}

/**
 * Reads the active tab's DOM rect to place the underline.
 * Falls back to 0/0 if refs aren't ready yet.
 */
function underlineLeft(listRef, activeIndex) {
    const el = listRef?.current?.children?.[activeIndex];
    if (!el) return 0;
    const parentRect = listRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return rect.left - parentRect.left + 8; // small inset to look tidy
}

function underlineWidth(listRef, activeIndex) {
    const el = listRef?.current?.children?.[activeIndex];
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.max(24, rect.width - 16); // match inset above
}
