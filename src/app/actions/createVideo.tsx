'use server';

import { z } from 'zod';

import { getSessionRole } from '../lib/session';
import supabaseAdmin from '../lib/supabase-admin';
import { createVideoFormSchema } from '../lib/utils';
import { extractYoutubeId, youtubeWatchUrl } from '../lib/youtube';

interface YoutubeOembedResponse {
    title: string;
    author_name: string;
}

export default async function createVideo(
    input: z.infer<typeof createVideoFormSchema>,
): Promise<{ ok: false; error: string } | { ok: true }> {
    try {
        if ((await getSessionRole()) !== 'admin') {
            return { ok: false, error: 'Not authorized' };
        }

        const validated = createVideoFormSchema.safeParse(input);
        if (!validated.success) {
            return { ok: false, error: validated.error.errors[0].message };
        }

        const { url, title, description, category } = validated.data;
        const youtubeId = extractYoutubeId(url);
        if (!youtubeId) {
            return { ok: false, error: 'Please paste a valid YouTube link' };
        }

        // oEmbed returns 401/404 for private, removed or non-embeddable videos
        const oembedResponse = await fetch(
            `https://www.youtube.com/oembed?url=${encodeURIComponent(
                youtubeWatchUrl(youtubeId),
            )}&format=json`,
            { signal: AbortSignal.timeout(10_000) },
        );
        if (!oembedResponse.ok) {
            return {
                ok: false,
                error: 'Video not found or not embeddable. Check that the video is public.',
            };
        }
        const oembed = (await oembedResponse.json()) as YoutubeOembedResponse;

        const { error } = await supabaseAdmin.from('videos').insert({
            youtube_id: youtubeId,
            source_url: url,
            title: title || null,
            description: description || null,
            category: category || null,
            youtube_title: oembed.title ?? null,
            youtube_channel: oembed.author_name ?? null,
        });

        if (error) {
            if (error.code === '23505') {
                return {
                    ok: false,
                    error: 'This video has already been added',
                };
            }
            console.error('Error creating video:', error);
            return { ok: false, error: 'Failed to add video' };
        }

        return { ok: true };
    } catch (error) {
        console.error('Error creating video:', error);
        return { ok: false, error: 'Failed to add video' };
    }
}
