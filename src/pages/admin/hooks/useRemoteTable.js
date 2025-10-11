import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

// Whitelist the columns that exist per table
const TABLE_COLUMNS = {
    sold: [
        'id','user_id','title','buyer','date','price','size','medium','notes','series','sku',
        'image_url','created_at',
        // ✅ dimensions in inches
        'width_in','height_in',
    ],
    expenses: [
        'id','user_id','vendor','category','date','amount','description','paymentMethod','receiptId',
        'image_url','notes','created_at'
    ],
};

// Convert a record coming from the UI into DB-safe snake_case keys
function toDbShape(table, rec) {
    if (!rec || typeof rec !== 'object') return rec;
    const out = { ...rec };

    // normalize common camelCase -> snake_case
    if ('createdAt'  in out) { out.created_at  = out.createdAt;  delete out.createdAt;  }
    if ('updatedAt'  in out) { out.updated_at  = out.updatedAt;  delete out.updatedAt;  }
    if ('imageUrl'   in out) { out.image_url   = out.imageUrl;   delete out.imageUrl;   }
    if ('receiptUrl' in out) { out.receipt_url = out.receiptUrl; delete out.receiptUrl; }

    // ✅ dimensions (support camelCase from UI or snake_case already) — inches
    if ('widthIn'  in out) { out.width_in  = out.widthIn;  delete out.widthIn;  }
    if ('heightIn' in out) { out.height_in = out.heightIn; delete out.heightIn; }

    // ✅ legacy safety: if feet values appear, convert to inches when inch fields missing
    if ('width_ft'  in out && out.width_ft  != null && out.width_in  == null) out.width_in  = Math.round(Number(out.width_ft)  * 12);
    if ('height_ft' in out && out.height_ft != null && out.height_in == null) out.height_in = Math.round(Number(out.height_ft) * 12);
    delete out.width_ft;
    delete out.height_ft;

    // add user_id if missing (caller ensures user is available)
    return out;
}

function pruneToKnownColumns(table, rec) {
    const cols = TABLE_COLUMNS[table] || [];
    const out = {};
    for (const k of cols) {
        if (rec[k] !== undefined) out[k] = rec[k]; // keep nulls, drop only undefined
    }
    return out;
}

export function useRemoteTable(table) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
        const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null));
        return () => sub.subscription.unsubscribe();
    }, []);

    const fetchRows = useCallback(async () => {
        setLoading(true);
        const q = supabase.from(table).select('*');
        // Order by created_at if you have it; fall back to date
        const { data, error } = await q
            .order('created_at', { ascending: false })
            .order('date', { ascending: false, nullsFirst: true });
        if (error) {
            console.error(`[${table}] select error:`, error);
        } else {
            setRows(data || []);
        }
        setLoading(false);
    }, [table]);

    useEffect(() => { if (user) fetchRows(); }, [user, fetchRows]);

    const upsert = useCallback(async (record) => {
        if (!user) throw new Error('Not signed in');

        // map & prune
        const normalized = toDbShape(table, { ...record, user_id: record?.user_id ?? user.id });
        const payload = pruneToKnownColumns(table, normalized);

        const { data, error } = await supabase.from(table).upsert(payload).select();
        if (error) {
            console.error(`[${table}] upsert error payload=`, payload, 'error=', error);
            throw error;
        }
        await fetchRows();
        return data?.[0];
    }, [table, user, fetchRows]);

    const remove = useCallback(async (id) => {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) {
            console.error(`[${table}] delete error:`, error);
            throw error;
        }
        await fetchRows();
    }, [table, fetchRows]);

    return { user, rows, loading, upsert, remove, refetch: fetchRows };
}
