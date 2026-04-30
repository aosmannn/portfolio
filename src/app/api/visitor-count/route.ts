// Run this SQL in Supabase:
// CREATE TABLE visitor_count (id integer PRIMARY KEY DEFAULT 1, count integer NOT NULL DEFAULT 0);
// INSERT INTO visitor_count VALUES (1, 0);

export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabase-admin';

function fallbackCount() {
  return 1300 + Math.floor(Math.random() * 200);
}

export async function GET() {
  try {
    // Read current count
    const { data: row, error: selectError } = await supabaseAdmin
      .from('visitor_count')
      .select('count')
      .eq('id', 1)
      .single();

    if (selectError || !row) {
      return Response.json({ count: fallbackCount() });
    }

    const newCount = (row.count as number) + 1;

    // Update to new count
    const { error: updateError } = await supabaseAdmin
      .from('visitor_count')
      .update({ count: newCount })
      .eq('id', 1);

    if (updateError) {
      return Response.json({ count: fallbackCount() });
    }

    return Response.json({ count: newCount });
  } catch {
    return Response.json({ count: fallbackCount() });
  }
}
