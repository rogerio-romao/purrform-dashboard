import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import VideoDetailsFields from '@/components/videos/video-details-fields';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import updateVideo from '@/app/actions/updateVideo';
import { updateVideoFormSchema } from '@/app/lib/utils';

import type { Video } from '@/app/lib/types';

interface EditVideoDialogProps {
    video: Video;
    categories: string[];
}

export default function EditVideoDialog({
    video,
    categories,
}: EditVideoDialogProps) {
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const currentValues = {
        title: video.title ?? '',
        description: video.description ?? '',
        category: video.category ?? '',
    };

    const form = useForm<z.infer<typeof updateVideoFormSchema>>({
        resolver: zodResolver(updateVideoFormSchema),
        defaultValues: currentValues,
    });

    async function handleSubmit(data: z.infer<typeof updateVideoFormSchema>) {
        const response = await updateVideo(video.id, data);

        if (!response.ok) {
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description: response.error,
            });
            return;
        }

        setDialogOpen(false);
        toast({
            variant: 'default',
            title: 'Success',
            description: 'Video updated successfully.',
        });
    }

    return (
        <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
                // always start from the latest saved values
                if (open) form.reset(currentValues);
                setDialogOpen(open);
            }}
        >
            <DialogTrigger asChild>
                <Button variant='ghost' size='icon' aria-label='Edit video'>
                    <Pencil className='w-4 h-4' />
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px] lg:max-w-[650px] max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Edit video</DialogTitle>
                    <DialogDescription>
                        {video.youtube_title
                            ? `YouTube title: ${video.youtube_title}`
                            : 'Update the details shown on the website.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className='space-y-4'
                    >
                        <div className='grid gap-4'>
                            <VideoDetailsFields
                                control={form.control}
                                categories={categories}
                                datalistId={`edit-video-categories-${video.id}`}
                            />
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant='outline' type='button'>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type='submit'
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? 'Saving...'
                                    : 'Save changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
