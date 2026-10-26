import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import DeleteVideoButton from '@/components/videos/delete-video-button';
import EditVideoDialog from '@/components/videos/edit-video-dialog';

import { youtubeThumbnail, youtubeWatchUrl } from '@/app/lib/youtube';

import type { Video } from '@/app/lib/types';

interface VideoCardProps {
    video: Video;
    categories: string[];
}

export default function VideoCard({ video, categories }: VideoCardProps) {
    const displayTitle = video.title || video.youtube_title || 'Untitled video';
    const usingYoutubeTitle = !video.title && Boolean(video.youtube_title);

    return (
        <Card className='flex flex-col overflow-hidden'>
            <a
                href={youtubeWatchUrl(video.youtube_id)}
                target='_blank'
                rel='noopener noreferrer'
                title='Watch on YouTube'
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={youtubeThumbnail(video.youtube_id)}
                    alt={displayTitle}
                    loading='lazy'
                    className='w-full aspect-video object-cover hover:opacity-90 transition-opacity'
                />
            </a>
            <CardHeader className='pb-2'>
                <CardTitle className='text-lg leading-snug'>
                    {displayTitle}
                </CardTitle>
                {usingYoutubeTitle ? (
                    <span className='text-xs text-muted-foreground'>
                        Title from YouTube
                    </span>
                ) : null}
            </CardHeader>
            <CardContent className='flex-1'>
                {video.description ? (
                    <CardDescription className='line-clamp-3'>
                        {video.description}
                    </CardDescription>
                ) : (
                    <CardDescription className='italic'>
                        No description
                    </CardDescription>
                )}
            </CardContent>
            <CardFooter className='flex items-center justify-between gap-2'>
                <div>
                    {video.category ? (
                        <Badge variant='secondary'>{video.category}</Badge>
                    ) : null}
                </div>
                <div className='flex items-center'>
                    <EditVideoDialog video={video} categories={categories} />
                    <DeleteVideoButton id={video.id} title={displayTitle} />
                </div>
            </CardFooter>
        </Card>
    );
}
