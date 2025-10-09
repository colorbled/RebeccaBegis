import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export default function AuthGate({ children }) {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [user, setUser] = useState(null);

    React.useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
        const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null));
        return () => sub.subscription.unsubscribe();
    }, []);

    if (user) return children;

    return (
        <div className="max-w-sm mx-auto my-12 rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-xl font-semibold">Sign in</h2>
            <p className="text-sm text-zinc-400 mt-1">We’ll email you a magic link.</p>
            {sent ? (
                <div className="mt-4 text-sm text-emerald-300">Check your email for the sign-in link.</div>
            ) : (
                <form
                    className="mt-4 space-y-3"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const { error } = await supabase.auth.signInWithOtp({ email });
                        if (!error) setSent(true);
                    }}
                >
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        placeholder="becca@example.com"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    />
                    <button className="w-full rounded-lg bg-white/90 text-black hover:bg-white px-3 py-2 text-sm font-medium">
                        Send magic link
                    </button>
                </form>
            )}
        </div>
    );
}
