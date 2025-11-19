import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const DEFAULTS = { cheap_ppi: 0.5, medium_ppi: 1.0, expensive_ppi: 1.5 };

export function usePricingPrefs() {
    const [user, setUser] = useState(null);
    const [prefs, setPrefs] = useState(DEFAULTS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // auth
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
        const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
        return () => sub?.subscription?.unsubscribe();
    }, []);

    const fetchPrefs = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError('');
        const { data, error } = await supabase
            .from('pricing_prefs')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (error) {
            // If no row yet, we’ll just keep defaults and let first save create it
            console.warn('[pricing_prefs] select error:', error);
            setPrefs(DEFAULTS);
        } else if (data) {
            setPrefs({
                cheap_ppi: Number(data.cheap_ppi ?? DEFAULTS.cheap_ppi),
                medium_ppi: Number(data.medium_ppi ?? DEFAULTS.medium_ppi),
                expensive_ppi: Number(data.expensive_ppi ?? DEFAULTS.expensive_ppi),
            });
        } else {
            setPrefs(DEFAULTS);
        }
        setLoading(false);
    }, [user]);

    useEffect(() => { if (user) fetchPrefs(); }, [user, fetchPrefs]);

    const save = useCallback(async (next) => {
        if (!user) throw new Error('Not signed in');
        setSaving(true);
        setError('');
        const payload = {
            user_id: user.id,
            cheap_ppi: Number(next.cheap_ppi ?? DEFAULTS.cheap_ppi),
            medium_ppi: Number(next.medium_ppi ?? DEFAULTS.medium_ppi),
            expensive_ppi: Number(next.expensive_ppi ?? DEFAULTS.expensive_ppi),
        };
        const { data, error } = await supabase
            .from('pricing_prefs')
            .upsert(payload, { onConflict: 'user_id' })
            .select()
            .maybeSingle();

        setSaving(false);

        if (error) {
            console.error('[pricing_prefs] upsert error:', error);
            setError(error.message || 'Save failed');
            throw error;
        }

        if (data) {
            setPrefs({
                cheap_ppi: Number(data.cheap_ppi),
                medium_ppi: Number(data.medium_ppi),
                expensive_ppi: Number(data.expensive_ppi),
            });
        }
    }, [user]);

    return { user, prefs, setPrefs, loading, saving, error, save, refetch: fetchPrefs, defaults: DEFAULTS };
}
