import { useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export function useRemoteTable(table) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Get current session (Becca)
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
        const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null));
        return () => sub.subscription.unsubscribe();
    }, []);

    const fetchRows = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .order('date', { ascending: false });
        if (!error) setRows(data || []);
        setLoading(false);
    }, [table]);

    useEffect(() => { if (user) fetchRows(); }, [user, fetchRows]);

    // Realtime (optional but nice)
    useEffect(() => {
        if (!user) return;
        const channel = supabase
            .channel(`${table}-changes`)
            .on('postgres_changes',
                { event: '*', schema: 'public', table },
                () => fetchRows()
            )
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [user, table, fetchRows]);

    const upsert = useCallback(async (record) => {
        const payload = { ...record };
        if (!payload.user_id) payload.user_id = user?.id;
        const { data, error } = await supabase.from(table).upsert(payload).select();
        if (error) throw error;
        await fetchRows();
        return data?.[0];
    }, [table, user, fetchRows]);

    const remove = useCallback(async (id) => {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw error;
        await fetchRows();
    }, [table, fetchRows]);

    return { user, rows, loading, upsert, remove, refetch: fetchRows };
}
