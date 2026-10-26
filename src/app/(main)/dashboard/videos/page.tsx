'use client';

import { useEffect, useState } from 'react';

import supabase from '@/app/lib/supabase';
import { useToast } from '@/hooks/use-toast';

import Loading from '@/components/common/loading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AddVideoDialog from '@/components/videos/add-video-dialog';
import VideoCard from '@/components/videos/video-card';

import type { Video } from '@/app/lib/types';

export default function Videos() {
    const { toast } = useToast();
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching videos:', error);
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description: 'An error occurred while fetching the videos.',
                });
            } else {
                setVideos(data as Video[]);
            }
            setLoading(false);
        };
        fetchVideos();
    }, [toast]);

    useEffect(() => {
        const changes = supabase
            .channel('videos-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'videos',
                },
                (payload) => {
                    if (payload.eventType === 'DELETE') {
                        setVideos((prevVideos) =>
                            prevVideos.filter(
                                (video) => video.id !== payload.old.id
                            )
                        );
                    } else if (payload.eventType === 'INSERT') {
                        const newVideo = payload.new as Video;
                        setVideos((prevVideos) =>
                            prevVideos.some((video) => video.id === newVideo.id)
                                ? prevVideos
                                : [newVideo, ...prevVideos]
                        );
                    } else if (payload.eventType === 'UPDATE') {
                        setVideos((prevVideos) =>
                            prevVideos.map((video) =>
                                video.id === payload.new.id
                                    ? (payload.new as Video)
                                    : video
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            changes.unsubscribe();
        };
    }, []);

    const categories = Array.from(
        new Set(
            videos
                .map((video) => video.category)
                .filter((category): category is string => Boolean(category))
        )
    ).sort((a, b) => a.localeCompare(b));

    if (loading) {
        return <Loading />;
    }

    return (
        <Card className='mt-4'>
            <CardHeader>
                <CardTitle>Videos</CardTitle>
                <CardDescription>
                    Manage the YouTube videos shown on the website. If no title
                    is given, the video&apos;s YouTube title is used. Changes
                    appear on the website straight away.
                </CardDescription>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                <AddVideoDialog categories={categories} />
                {videos.map((video) => (
                    <VideoCard
                        key={video.id}
                        video={video}
                        categories={categories}
                    />
                ))}
            </CardContent>
        </Card>
    );
}
