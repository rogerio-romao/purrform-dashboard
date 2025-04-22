import { Pencil } from 'lucide-react';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import DeleteIngredient from './delete-ingredient';
import UpdateIngredientModal from './update-ingredient-modal';

import type { IngredientsProps } from '@/app/lib/types';

export default function IngredientsTable({
    ingredients,
    setIngredients,
    handleGetCoordinates,
}: IngredientsProps) {
    return (
        <TableBody>
            {ingredients.map((ingredient) => (
                <TableRow key={ingredient.properties.id}>
                    <TableCell>{ingredient.properties.title}</TableCell>
                    <TableCell>{ingredient.properties.location}</TableCell>
                    <TableCell>{ingredient.geometry.coordinates[0]}</TableCell>
                    <TableCell>{ingredient.geometry.coordinates[1]}</TableCell>
                    <TableCell>
                        <div className='flex items-center gap-2'>
                            <Dialog>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <DialogTrigger asChild>
                                                <button>
                                                    <Pencil className='w-4 h-4' />
                                                </button>
                                            </DialogTrigger>
                                        </TooltipTrigger>
                                        <UpdateIngredientModal
                                            ingredient={ingredient}
                                            setIngredients={setIngredients}
                                            handleGetCoordinates={
                                                handleGetCoordinates
                                            }
                                        />

                                        <TooltipContent
                                            side='top'
                                            align='center'
                                        >
                                            Edit
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Dialog>
                            <DeleteIngredient
                                id={ingredient.properties.id}
                                setIngredients={setIngredients}
                            />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}
