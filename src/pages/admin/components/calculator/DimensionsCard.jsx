// src/components/calculator/DimensionsCard.jsx
import React from 'react';
import { Ruler, MoveHorizontal, MoveVertical } from 'lucide-react';

export default function DimensionsCard({
                                           w, h, onChangeW, onChangeH, presets = [], onApplyPreset
                                       }) {
    const widthNum  = Number(w);
    const heightNum = Number(h);

    const isActivePreset = (pw, ph) =>
        Number.isFinite(widthNum) &&
        Number.isFinite(heightNum) &&
        widthNum === Number(pw) &&
        heightNum === Number(ph);

    return (
        <section className="rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-sm">
            <div className="p-4 md:p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="rounded-md bg-zinc-100 p-2 border border-zinc-200">
                        <Ruler className="h-4 w-4 text-zinc-600" />
                    </div>
                    <div className="text-sm font-medium text-zinc-800">Dimensions</div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block">
                        <span className="block text-xs font-medium text-zinc-600 mb-1">Width</span>
                        <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <MoveHorizontal className="h-4 w-4" />
              </span>
                            <input
                                inputMode="decimal"
                                value={w}
                                onChange={(e) => onChangeW(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 bg-white pl-9 pr-10 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/10"
                                aria-label="Width (inches)"
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">in</span>
                        </div>
                    </label>

                    <label className="block">
                        <span className="block text-xs font-medium text-zinc-600 mb-1">Height</span>
                        <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <MoveVertical className="h-4 w-4" />
              </span>
                            <input
                                inputMode="decimal"
                                value={h}
                                onChange={(e) => onChangeH(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 bg-white pl-9 pr-10 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/10"
                                aria-label="Height (inches)"
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">in</span>
                        </div>
                    </label>
                </div>

                <div className="my-4 h-px bg-zinc-200/70" />

                {/* Quick sizes with active state */}
                <div>
                    <div className="text-xs font-medium text-zinc-600 mb-2">Quick sizes</div>
                    <div className="flex flex-wrap gap-2">
                        {presets.map(([pw, ph]) => {
                            const active = isActivePreset(pw, ph);
                            return (
                                <button
                                    key={`${pw}x${ph}`}
                                    onClick={() => onApplyPreset?.(pw, ph)}
                                    aria-pressed={active}
                                    className={
                                        active
                                            ? // active: white text on #333 background
                                            "rounded-lg border px-2.5 py-1.5 text-xs shadow-sm focus:outline-none focus:ring-2 " +
                                            "text-white border-[#333] bg-[#333] hover:bg-[#2b2b2b] active:bg-[#262626] " +
                                            "focus:ring-zinc-800/20"
                                            : // default (subtle but visible on white)
                                            "rounded-lg border border-zinc-300 bg-zinc-100/90 ring-1 ring-inset ring-white/10 " +
                                            "hover:bg-zinc-200 active:bg-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 " +
                                            "shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-800/10"
                                    }
                                    title={`${pw}×${ph} in`}
                                >
                                    {pw}×{ph}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
