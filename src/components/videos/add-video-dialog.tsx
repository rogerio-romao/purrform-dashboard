import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import VideoDetailsFields from '@/components/videos/video-details-fields';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import createVideo from '@/app/actions/createVideo';
import { createVideoFormSchema } from '@/app/lib/utils';
import { extractYoutubeId, youtubeThumbnail } from '@/app/lib/youtube';

interface AddVideoDialogProps {
    categories: string[];
}

export default function AddVideoDialog({ categories }: AddVideoDialogProps) {
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const form = useForm<z.infer<typeof createVideoFormSchema>>({
        resolver: zodResolver(createVideoFormSchema),
        mode: 'onChange',
        defaultValues: {
            url: '',
            title: '',
            description: '',
            category: '',
        },
    });

    const previewId = extractYoutubeId(form.watch('url') ?? '');

    async function handleSubmit(data: z.infer<typeof createVideoFormSchema>) {
        const response = await createVideo(data);

        if (!response.ok) {
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description: response.error,
            });
            return;
        }

        // the list itself is updated by the realtime subscription
        form.reset();
        setDialogOpen(false);
        toast({
            variant: 'default',
            title: 'Success',
            description: 'Video added successfully.',
        });
    }

    return (
        <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) form.reset();
            }}
        >
            <DialogTrigger asChild>
                <Card className='flex flex-col cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors group min-h-[280px]'>
                    <CardHeader>
                        <CardTitle className='text-lg'>Add Video</CardTitle>
                        <CardDescription>
                            Paste a link to any YouTube video to add it to the
                            website.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex-1'>
                        <div className='flex items-center justify-center h-full'>
                            <CirclePlus
                                height={36}
                                width={36}
                                className='group-hover:text-green-600'
                            />
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px] lg:max-w-[650px] max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Add a new video</DialogTitle>
                    <DialogDescription>
                        Copy the link from YouTube (from the address bar or the
                        Share button) and paste it below.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className='space-y-4'
                    >
                        <div className='grid gap-4'>
                            <FormField
                                control={form.control}
                                name='url'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>YouTube link</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='https://www.youtube.com/watch?v=...'
                                                autoComplete='off'
                                                {...field}
                                            />
                                        </FormControl>
                                        {previewId ? (
                                            <FormDescription>
                                                Video found:
                                            </FormDescription>
                                        ) : null}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {previewId ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={youtubeThumbnail(previewId)}
                                    alt='Video preview'
                                    className='w-full max-w-xs rounded-md aspect-video object-cover'
                                />
                            ) : null}

                            <VideoDetailsFields
                                control={form.control}
                                categories={categories}
                                datalistId='add-video-categories'
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
                                disabled={
                                    form.formState.isSubmitting ||
                                    !form.formState.isValid
                                }
                            >
                                {form.formState.isSubmitting
                                    ? 'Adding...'
                                    : 'Add video'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
