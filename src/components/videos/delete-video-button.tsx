import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';

import deleteVideo from '@/app/actions/deleteVideo';

interface DeleteVideoButtonProps {
    id: number;
    title: string;
}

export default function DeleteVideoButton({
    id,
    title,
}: DeleteVideoButtonProps) {
    const { toast } = useToast();
    const [deleting, setDeleting] = useState<boolean>(false);

    async function handleDelete() {
        setDeleting(true);
        try {
            const response = await deleteVideo(id);

            if (!response.ok) {
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description: response.error,
                });
                return;
            }

            // the list itself is updated by the realtime subscription
            toast({
                variant: 'default',
                title: 'SUCCESS',
                description: 'Video deleted successfully.',
            });
        } catch {
            toast({
                variant: 'destructive',
                title: 'ERROR',
                description: 'Failed to delete video',
            });
        } finally {
            setDeleting(false);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant='ghost'
                    size='icon'
                    aria-label='Delete video'
                    disabled={deleting}
                    className='hover:text-destructive'
                >
                    <Trash2 className='w-4 h-4' />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this video?</AlertDialogTitle>
                    <AlertDialogDescription>
                        &quot;{title}&quot; will be removed from the website.
                        You can add it again later if needed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className={buttonVariants({ variant: 'destructive' })}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
