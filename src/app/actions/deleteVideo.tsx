'use server';

import { getSessionRole } from '../lib/session';
import supabaseAdmin from '../lib/supabase-admin';

export default async function deleteVideo(
    id: number
): Promise<{ ok: false; error: string } | { ok: true }> {
    try {
        if ((await getSessionRole()) !== 'admin') {
            return { ok: false, error: 'Not authorized' };
        }

        const { error } = await supabaseAdmin
            .from('videos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting video:', error);
            return { ok: false, error: 'Failed to delete video' };
        }

        return { ok: true };
    } catch (error) {
        console.error('Error deleting video:', error);
        return { ok: false, error: 'Failed to delete video' };
    }
}
