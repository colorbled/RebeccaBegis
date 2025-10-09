// src/components/AuthGate.jsx
import React from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AuthGate({ children }) {
    const [user, setUser] = React.useState(null);
    const [checking, setChecking] = React.useState(true);

    React.useEffect(() => {
        let unsub = () => {};
        (async () => {
            // 1) Load current session
            const { data } = await supabase.auth.getSession();
            setUser(data.session?.user ?? null);

            // 2) Subscribe to auth changes
            const sub = supabase.auth.onAuthStateChange((_evt, session) => {
                setUser(session?.user ?? null);
            });
            unsub = () => sub.data.subscription.unsubscribe();

            setChecking(false);
        })();

        return () => unsub();
    }, []);

    if (checking) {
        return (
            <div className="max-w-sm mx-auto my-12 rounded-xl border border-white/10 bg-white/[0.04] p-5 text-sm text-zinc-400">
                Checking sign-in…
            </div>
        );
    }

    if (!user) return <PasswordSignInForm />;

    return children;
}

function PasswordSignInForm() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [err, setErr] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr('');
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            // success → onAuthStateChange will cause AuthGate to render children
        } catch (e) {
            setErr(e?.message || 'Sign-in failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto my-12 rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-lg font-semibold">Sign in</h2>
            <p className="text-sm text-zinc-400 mt-1">Use your email and password.</p>

            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="becca@example.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    autoComplete="username"
                />
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    autoComplete="current-password"
                />

                {err && <div className="text-sm text-rose-400">{err}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-white/90 text-black hover:bg-white px-3 py-2 text-sm font-medium disabled:opacity-60"
                >
                    {loading ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
        </div>
    );
}
