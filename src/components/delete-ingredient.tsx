import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip';

import deleteIngredient from '@/app/actions/deleteIngredient';
import { SetIngredients } from '@/app/lib/types';

interface DeleteIngredientProps {
    setIngredients: SetIngredients;
    id: number;
}

export default function DeleteIngredient({
    setIngredients,
    id,
}: DeleteIngredientProps) {
    const { toast } = useToast();

    function handleDeleteIngredient(id: number) {
        deleteIngredient(id).then((success) => {
            if (!success) {
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description: 'Failed to delete ingredient.',
                });
                return;
            }

            setIngredients((prevIngredients) =>
                prevIngredients.filter(
                    (ingredient) => ingredient.properties.id !== id
                )
            );

            toast({
                variant: 'default',
                title: 'SUCCESS',
                description: 'Ingredient deleted successfully.',
            });
        });
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button onClick={() => handleDeleteIngredient(id)}>
                        <Trash2 className='w-4 h-4' />
                    </button>
                </TooltipTrigger>
                <TooltipContent side='top' align='center'>
                    Delete
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
