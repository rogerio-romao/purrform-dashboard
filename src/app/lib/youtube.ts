const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

const YOUTUBE_HOSTS = [
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'music.youtube.com',
    'youtube-nocookie.com',
    'www.youtube-nocookie.com',
];

// Path prefixes that are followed by the video id, e.g. /shorts/{id}
const ID_PATH_PREFIXES = ['embed', 'shorts', 'live', 'v'];

/**
 * Extracts the 11 character YouTube video id from whatever the user pasted:
 * a bare id, or any of the common YouTube url formats (watch, youtu.be,
 * shorts, embed, live, mobile, with or without protocol / extra params).
 */
export function extractYoutubeId(input: string): string | null {
    const value = input.trim();

    if (YOUTUBE_ID_REGEX.test(value)) {
        return value;
    }

    let url: URL;
    try {
        url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    } catch {
        return null;
    }

    const host = url.hostname.toLowerCase();
    const segments = url.pathname.split('/').filter(Boolean);
    let candidate: string | null = null;

    if (host === 'youtu.be' || host === 'www.youtu.be') {
        candidate = segments[0] ?? null;
    } else if (YOUTUBE_HOSTS.includes(host)) {
        if (segments[0] === 'watch') {
            candidate = url.searchParams.get('v');
        } else if (ID_PATH_PREFIXES.includes(segments[0])) {
            candidate = segments[1] ?? null;
        }
    }

    return candidate && YOUTUBE_ID_REGEX.test(candidate) ? candidate : null;
}

export function youtubeThumbnail(id: string): string {
    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youtubeWatchUrl(id: string): string {
    return `https://www.youtube.com/watch?v=${id}`;
}
