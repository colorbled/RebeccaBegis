// src/components/CalculatorPanel.jsx
import React from 'react';
import {
    Calculator, Ruler, RefreshCw,
    MoveHorizontal, MoveVertical, Grid3x3
} from 'lucide-react';
import Money from '../ui/Money';

const SS_KEY = 'calc:v1';

// numeric helpers
function num(v){ const n=Number(v); return Number.isFinite(n)?n:0; }
const sanitize = (s)=> s.replace(/[^\d.]/g,'');
const round2 = (n)=> Math.round((Number(n)+Number.EPSILON)*100)/100;
const trunc2 = (n)=> (Number.isFinite(+n) ? Math.trunc(+n*100)/100 : 0);
const fmtNum = (n,d=2)=> Number.isFinite(n)?Number(n).toFixed(d).replace(/\.?0+$/,''):'0';

export default function CalculatorPanel(){
    const [w,setW]=React.useState('');
    const [h,setH]=React.useState('');
    const [pricePerIn,setPricePerIn]=React.useState('');
    const [totalPrice,setTotalPrice]=React.useState('');
    const [lastEdited,setLastEdited]=React.useState(null);
    const [hydrated,setHydrated]=React.useState(false);

    React.useEffect(()=>{
        try{
            const raw=sessionStorage.getItem(SS_KEY);
            if(raw){
                const s=JSON.parse(raw)||{};
                setW(s.w??''); setH(s.h??'');
                setPricePerIn(s.pricePerIn??''); setTotalPrice(s.totalPrice??'');
                setLastEdited(s.lastEdited??null);
            }
        }catch{}
        setHydrated(true);
    },[]);
    React.useEffect(()=>{
        if(!hydrated) return;
        try{
            sessionStorage.setItem(SS_KEY, JSON.stringify({w,h,pricePerIn,totalPrice,lastEdited}));
        }catch{}
    },[w,h,pricePerIn,totalPrice,lastEdited,hydrated]);

    const width=num(w), height=num(h);
    const squareInches = width>0 && height>0 ? width*height : 0;

    React.useEffect(()=>{
        if(!hydrated || !squareInches) return;
        if(lastEdited==='ppi' && pricePerIn!==''){
            setTotalPrice(String(round2(squareInches*num(pricePerIn))));
        }else if(lastEdited==='total' && totalPrice!==''){
            setPricePerIn(String(trunc2(num(totalPrice)/squareInches)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[squareInches]);

    const onChangePpi=(s)=>{
        const v=sanitize(s);
        setPricePerIn(v); setLastEdited('ppi');
        if(squareInches){
            setTotalPrice(v===''? '': String(round2(squareInches*num(v))));
        }
    };
    const onBlurPpi=()=>{
        if(pricePerIn==='') return;
        const p=trunc2(pricePerIn);
        setPricePerIn(p===0? '': p.toFixed(2));
    };

    const onChangeTotal=(s)=>{
        const v=sanitize(s);
        setTotalPrice(v); setLastEdited('total');
        if(squareInches){
            const p=trunc2(num(v)/squareInches);
            setPricePerIn(v===''? '': (Number.isFinite(p)? String(p): ''));
        }
    };
    const onBlurTotal=()=>{
        if(totalPrice==='') return;
        const t=round2(totalPrice);
        setTotalPrice(t===0? '': t.toFixed(2));
    };

    const onChangeW=(s)=> setW(sanitize(s));
    const onChangeH=(s)=> setH(sanitize(s));
    const clearAll=()=>{ setW(''); setH(''); setPricePerIn(''); setTotalPrice(''); setLastEdited(null); };

    const primaryTotal = totalPrice!=='' ? round2(num(totalPrice))
        : (pricePerIn!=='' ? round2(squareInches*num(pricePerIn)) : 0);
    const primaryPpi   = pricePerIn!=='' ? trunc2(num(pricePerIn))
        : (squareInches ? trunc2(num(totalPrice)/squareInches) : 0);

    const presets=[[8,10],[11,14],[12,12],[12,16],[16,20],[18,24],[24,30],[24,36],[30,40]];

    return (
        <div className="mx-auto w-full max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Dimensions — subtle distinct styling */}
                <div className="md:col-span-2 rounded-xl border border-indigo-400/20 ring-1 ring-inset ring-indigo-500/10 bg-gradient-to-b from-indigo-500/[0.06] to-white/[0.03] p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-zinc-300 mb-3">
                        <Ruler className="h-4 w-4" />
                        Dimensions (inches)
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <MoveHorizontal className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <input
                                inputMode="decimal"
                                value={w}
                                onChange={(e)=>onChangeW(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-black/40 pl-9 pr-3 py-2 text-zinc-100"
                                aria-label="Width (inches)"
                            />
                        </div>

                        <div className="relative">
                            <MoveVertical className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <input
                                inputMode="decimal"
                                value={h}
                                onChange={(e)=>onChangeH(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-black/40 pl-9 pr-3 py-2 text-zinc-100"
                                aria-label="Height (inches)"
                            />
                        </div>
                    </div>

                    {/* Quick presets */}
                    <div className="mt-3 flex flex-wrap gap-2">
                        {presets.map(([pw,ph])=>(
                            <button
                                key={`${pw}x${ph}`}
                                onClick={()=>{ setW(String(pw)); setH(String(ph)); }}
                                className="rounded-md border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-xs text-zinc-200"
                                title={`${pw}×${ph} in`}
                            >
                                {pw}×{ph}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pricing */}
                <div className="md:col-span-1 rounded-xl border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-300 mb-3">
                        <Calculator className="h-4 w-4" />
                        Pricing
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs uppercase tracking-wide text-zinc-400">Total Price</label>
                            <div className="relative mt-1">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                                <input
                                    inputMode="decimal"
                                    value={totalPrice}
                                    onChange={(e)=>onChangeTotal(e.target.value)}
                                    onBlur={onBlurTotal}
                                    className="w-full rounded-lg border border-white/10 bg-black/40 pl-7 pr-3 py-2 text-zinc-100"
                                    aria-label="Total price"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-wide text-zinc-400">Price per in²</label>
                            <div className="relative mt-1">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                                <input
                                    inputMode="decimal"
                                    value={pricePerIn}
                                    onChange={(e)=>onChangePpi(e.target.value)}
                                    onBlur={onBlurPpi}
                                    className="w-full rounded-lg border border-white/10 bg-black/40 pl-7 pr-14 py-2 text-zinc-100"
                                    aria-label="Price per square inch"
                                />
                                {/* ✅ Add Grid3x3 icon next to /in² for semantic tie-in */}
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs inline-flex items-center gap-1">
                  <Grid3x3 className="h-4 w-4" /> /in²
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Emphasized calculated outputs */}
                    <div className="mt-4 space-y-2">
                        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/[0.08] px-3 py-2 text-sm flex items-center justify-between">
                            <span className="text-emerald-200/90">Total (calculated)</span>
                            <span className="font-semibold text-emerald-100">
                <Money value={primaryTotal || 0} />
              </span>
                        </div>
                        <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/[0.08] px-3 py-2 text-sm flex items-center justify-between">
                            <span className="text-cyan-200/90">Price per in² (calculated)</span>
                            <span className="font-semibold text-cyan-100">
                ${fmtNum(primaryPpi, 2)}
              </span>
                        </div>
                    </div>

                    {/* Dimensions Summary (full-width rows) */}
                    <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
                        <div className="text-[11px] uppercase tracking-wide text-zinc-400 mb-2">
                            Dimensions Summary
                        </div>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 flex items-center justify-between">
                <span className="text-zinc-400 inline-flex items-center gap-1">
                  <MoveHorizontal className="h-4 w-4" /> Width
                </span>
                                <span className="tabular-nums text-zinc-100 inline-flex items-center gap-1">
                  {fmtNum(width,2)} <span className="text-zinc-400">in</span>
                </span>
                            </div>
                            <div className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 flex items-center justify-between">
                <span className="text-zinc-400 inline-flex items-center gap-1">
                  <MoveVertical className="h-4 w-4" /> Height
                </span>
                                <span className="tabular-nums text-zinc-100 inline-flex items-center gap-1">
                  {fmtNum(height,2)} <span className="text-zinc-400">in</span>
                </span>
                            </div>
                            <div className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 flex items-center justify-between">
                <span className="text-zinc-400 inline-flex items-center gap-1">
                  <Grid3x3 className="h-4 w-4" /> Square Inches
                </span>
                                <span className="tabular-nums text-zinc-100 inline-flex items-center gap-1">
                  {fmtNum(squareInches,2)} <span className="text-zinc-400">in²</span>
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Clear */}
                    <div className="mt-3">
                        <button
                            onClick={clearAll}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm"
                            title="Clear"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
