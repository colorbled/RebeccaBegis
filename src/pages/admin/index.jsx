import React, { useEffect, useMemo, useState } from 'react';
import { Plus, X, DollarSign, Wallet, TrendingUp, Download, LogOut } from 'lucide-react';
import TabNav from './components/TabNav';
import SoldForm from './components/SoldForm';
import SoldList from './components/SoldList';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Money from './ui/Money';
import { useRemoteTable } from './hooks/useRemoteTable';
import AuthGate from './components/AuthGate';
import { supabase } from './lib/supabaseClient'; // ⬅️ adjust the path if your client lives elsewhere
import CalculatorPanel from './components/CalculatorPanel';

// --- tiny helper for optional CSV export (kept local to the page) ---
function exportCsv(filename, rows) {
    if (!rows?.length) return;
    const headers = Object.keys(rows[0]);
    const body = rows.map(r =>
        headers
            .map(h => {
                const cell = r[h] ?? '';
                const s = String(cell).replace(/"/g, '""');
                return /[",\n]/.test(s) ? `"${s}"` : s;
            })
            .join(',')
    );
    const csv = [headers.join(','), ...body].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

export default function Admin() {
    const [tab, setTab] = useState('sold');

    // 🚫 Tell crawlers not to index this page (no dependency).
    useEffect(() => {
        const robots = document.createElement('meta');
        robots.name = 'robots';
        robots.content = 'noindex,nofollow,noarchive';

        const googlebot = document.createElement('meta');
        googlebot.name = 'googlebot';
        googlebot.content = 'noindex,nofollow,noarchive';

        document.head.appendChild(robots);
        document.head.appendChild(googlebot);

        return () => {
            document.head.removeChild(robots);
            document.head.removeChild(googlebot);
        };
    }, []);

    // Remote tables (no local setState for arrays)
    const { rows: sold, upsert: upsertSold, remove: removeSold } = useRemoteTable('sold');
    const [editingSold, setEditingSold] = useState(null);

    const { rows: expenses, upsert: upsertExpense, remove: removeExpense } = useRemoteTable('expenses');
    const [editingExpense, setEditingExpense] = useState(null);

    const soldTotal = useMemo(() => sold.reduce((s, i) => s + Number(i.price || 0), 0), [sold]);
    const expensesTotal = useMemo(() => expenses.reduce((s, i) => s + Number(i.amount || 0), 0), [expenses]);
    const net = soldTotal - expensesTotal;

    // --- UI helpers (purely visual) ---
    const Card = ({ tone = 'zinc', icon: Icon, label, value, hint }) => {
        const toneMap = {
            emerald: 'from-emerald-500/15 to-emerald-400/5 text-emerald-200',
            amber: 'from-amber-500/15 to-amber-400/5 text-amber-200',
            cyan: 'from-cyan-500/15 to-cyan-400/5 text-cyan-200',
            zinc: 'from-white/10 to-transparent text-zinc-200',
        };
        const toneText = {
            emerald: 'text-emerald-300',
            amber: 'text-amber-300',
            cyan: 'text-cyan-300',
            zinc: 'text-zinc-300',
        }[tone];

        return (
            <div className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
                <div className="relative p-4">
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-tr ${toneMap[tone]} pointer-events-none`} />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <div className={`text-xs uppercase tracking-wide ${toneText}`}>{label}</div>
                            <div className="mt-1 text-lg font-semibold">{value}</div>
                            {hint ? <div className="mt-1 text-[11px] text-zinc-400">{hint}</div> : null}
                        </div>
                        {Icon ? (
                            <div className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-2">
                                <Icon className="h-5 w-5 opacity-90" />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    };

    // Mobile-first sticky toolbar
    const Toolbar = ({ left, right }) => (
        <div className="sticky top-0 z-[1] -mx-6 md:-mx-5 -mt-3 md:-mt-5 px-6 md:px-5 py-3 bg-black/30 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md border-b border-white/5">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 md:justify-between">
                <div className="flex items-center gap-2">{left}</div>
                <div className="flex flex-wrap items-center gap-2">{right}</div>
            </div>
        </div>
    );

    const PrimaryBtn = ({ children, className = '', ...props }) => (
        <button
            {...props}
            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-white/90 text-black hover:bg-white px-3 py-2 text-sm font-medium shadow-sm w-full md:w-auto ${className}`}
        >
            {children}
        </button>
    );

    const GhostBtn = ({ children, className = '', ...props }) => (
        <button
            {...props}
            className={`inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm w-full md:w-auto ${className}`}
        >
            {children}
        </button>
    );

    const SignOutBtn = () => (
        <button
            onClick={async () => { await supabase.auth.signOut(); }}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm"
            title="Sign out"
            aria-label="Sign out"
        >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
        </button>
    );

    return (
        <AuthGate>
            <div className="p-6 md:p-10 max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-4 md:mb-6">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Admin</h1>
                            <p className="mt-1 text-sm text-zinc-400">Sales &amp; studio expenditures</p>
                        </div>
                        <SignOutBtn />
                    </div>
                </header>

                {/* KPI strip */}
                <section className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    <Card
                        tone="emerald"
                        icon={DollarSign}
                        label="Sales"
                        value={<Money value={soldTotal} />}
                        hint={sold.length ? `${sold.length} sale${sold.length > 1 ? 's' : ''}` : 'No sales yet'}
                    />
                    <Card
                        tone="amber"
                        icon={Wallet}
                        label="Expenses"
                        value={<Money value={expensesTotal} />}
                        hint={expenses.length ? `${expenses.length} record${expenses.length > 1 ? 's' : ''}` : 'No expenses yet'}
                    />
                    <Card
                        tone="cyan"
                        icon={TrendingUp}
                        label="Net"
                        value={<Money value={net} />}
                        hint={net >= 0 ? 'In the green' : 'In the red'}
                    />
                </section>

                {/* Tab Navigation under KPIs */}
                <nav aria-label="Sections" className="mt-4 md:mt-6 mb-6 md:mb-8">
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                        <TabNav
                            value={tab}
                            onChange={setTab}
                            tabs={[
                                { value: 'sold', label: 'Paintings Sold' },
                                { value: 'expenses', label: 'Expenditures' },
                                { value: 'calc', label: 'Calculator' },
                            ]}
                        />
                    </div>
                </nav>

                {/* Panels */}
                <main className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-5 md:p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                    {tab === 'sold' ? (
                        <div className="grid gap-6">
                            <Toolbar
                                left={<h2 className="text-base md:text-lg font-semibold">Paintings Sold</h2>}
                                right={
                                    <>
                                        <GhostBtn onClick={() => exportCsv('paintings-sold.csv', sold)}>
                                            <Download className="h-4 w-4" />
                                            <span className="hidden sm:inline">Export CSV</span>
                                        </GhostBtn>
                                        <PrimaryBtn onClick={() => setEditingSold({})}>
                                            <Plus className="h-4 w-4" />
                                            <span className="hidden sm:inline">Add Sale</span>
                                            <span className="sm:hidden">Add</span>
                                        </PrimaryBtn>
                                    </>
                                }
                            />

                            {editingSold && (
                                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                        <div className="font-medium">{editingSold?.id ? 'Edit Sale' : 'New Sale'}</div>
                                        <GhostBtn onClick={() => setEditingSold(null)} title="Close">
                                            <X className="w-4 h-4" />
                                            Close
                                        </GhostBtn>
                                    </div>
                                    <SoldForm
                                        initial={editingSold?.id ? editingSold : undefined}
                                        onSave={async (rec) => {
                                            await upsertSold(rec);
                                            setEditingSold(null);
                                        }}
                                    />
                                </div>
                            )}

                            <SoldList
                                items={[...sold].sort((a, b) => (b.date || '').localeCompare(a.date || ''))}
                                onEdit={setEditingSold}
                                onDelete={removeSold}
                            />
                        </div>
                    ) : tab === 'expenses' ? (
                        <div className="grid gap-6">
                            <Toolbar
                                left={<h2 className="text-base md:text-lg font-semibold">Expenditures</h2>}
                                right={
                                    <>
                                        <GhostBtn onClick={() => exportCsv('expenditures.csv', expenses)}>
                                            <Download className="h-4 w-4" />
                                            <span className="hidden sm:inline">Export CSV</span>
                                        </GhostBtn>
                                        <PrimaryBtn onClick={() => setEditingExpense({})}>
                                            <Plus className="h-4 w-4" />
                                            <span className="hidden sm:inline">Add Expense</span>
                                            <span className="sm:hidden">Add</span>
                                        </PrimaryBtn>
                                    </>
                                }
                            />

                            {editingExpense && (
                                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                        <div className="font-medium">{editingExpense?.id ? 'Edit Expense' : 'New Expense'}</div>
                                        <GhostBtn onClick={() => setEditingExpense(null)} title="Close">
                                            <X className="w-4 h-4" />
                                            Close
                                        </GhostBtn>
                                    </div>
                                    <ExpenseForm
                                        initial={editingExpense?.id ? editingExpense : undefined}
                                        onSave={async (rec) => {
                                            await upsertExpense(rec);
                                            setEditingExpense(null);
                                        }}
                                    />
                                </div>
                            )}

                            <ExpenseList
                                items={[...expenses].sort((a, b) => (b.date || '').localeCompare(a.date || ''))}
                                onEdit={setEditingExpense}
                                onDelete={removeExpense}
                            />
                        </div>
                    ) : tab === 'calc' ? (
                        <div className="grid gap-6">
                            <Toolbar left={<h2 className="text-base md:text-lg font-semibold">Calculator</h2>} right={null} />
                            <CalculatorPanel />
                        </div>
                    ) : null}
                </main>
            </div>
        </AuthGate>
    );
}
