import type { Control, FieldValues, Path } from 'react-hook-form';

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface VideoDetailsFieldsProps<T extends FieldValues> {
    control: Control<T>;
    categories: string[];
    datalistId: string;
}

/** Title / description / category fields shared by the add and edit forms. */
export default function VideoDetailsFields<T extends FieldValues>({
    control,
    categories,
    datalistId,
}: VideoDetailsFieldsProps<T>) {
    return (
        <>
            <FormField
                control={control}
                name={'title' as Path<T>}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title (optional)</FormLabel>
                        <FormControl>
                            <Input
                                placeholder='Leave empty to use the YouTube title'
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name={'description' as Path<T>}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder='A short description shown on the website'
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name={'category' as Path<T>}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category (optional)</FormLabel>
                        <FormControl>
                            <Input
                                placeholder='e.g. Feeding guides'
                                list={datalistId}
                                autoComplete='off'
                                {...field}
                            />
                        </FormControl>
                        <datalist id={datalistId}>
                            {categories.map((category) => (
                                <option key={category} value={category} />
                            ))}
                        </datalist>
                        <FormDescription>
                            Pick an existing category or type a new one.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}
