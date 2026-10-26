'use server';

import { z } from 'zod';

import { getSessionRole } from '../lib/session';
import supabaseAdmin from '../lib/supabase-admin';
import { updateVideoFormSchema } from '../lib/utils';

export default async function updateVideo(
    id: number,
    input: z.infer<typeof updateVideoFormSchema>
): Promise<{ ok: false; error: string } | { ok: true }> {
    try {
        if ((await getSessionRole()) !== 'admin') {
            return { ok: false, error: 'Not authorized' };
        }

        const validated = updateVideoFormSchema.safeParse(input);
        if (!validated.success) {
            return { ok: false, error: validated.error.errors[0].message };
        }

        const { title, description, category } = validated.data;

        const { error } = await supabaseAdmin
            .from('videos')
            .update({
                title: title || null,
                description: description || null,
                category: category || null,
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating video:', error);
            return { ok: false, error: 'Failed to update video' };
        }

        return { ok: true };
    } catch (error) {
        console.error('Error updating video:', error);
        return { ok: false, error: 'Failed to update video' };
    }
}
