import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function calculateDifference(value1: number, value2: number): number {
    if (value1 === 0 && value2 === 0) {
        return 0;
    }

    const difference = Math.abs(value1 - value2);
    const percentageDifference = (difference / value1) * 100;

    return percentageDifference;
}

export const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const createIngredientsFormSchema = z.object({
    title: z
        .string({ required_error: 'Title is required' })
        .min(3, 'Title must be at least 3 characters'),
    location: z
        .string({ required_error: 'Location is required' })
        .min(3, 'Location must be at least 3 characters'),
    longitude: z.number({ required_error: 'Longitude is required' }),
    latitude: z.number({ required_error: 'Latitude is required' }),
});

export const recallProductsFormSchema = z.object({
    selectedProductName: z.string({ required_error: 'Product is required' }),
    selectedProductId: z.number({ required_error: 'Product ID is required' }),
    startDate: z.string({ required_error: 'Start date is required' }).date(),
    endDate: z.string({ required_error: 'End date is required' }).date(),
});

export const traderOnCreditFormSchema = z.object({
    selectedTraderId: z.number().min(1, 'Please select a trader'), // Make sure it requires a value > 0
    selectedTraderCompany: z.string().min(1, 'Please select a trader company'),
    selectedTraderEmail: z.string().email('Invalid email format'),
});

export const addTraderToCreditFormSchema = z.object({
    selectedTraderId: z.number().min(1, 'Please select a trader'), // Make sure it requires a value > 0
    selectedTraderCompany: z.string().min(1, 'Please select a trader company'),
    selectedTraderEmail: z.string().email('Invalid email format'),
    creditAmount: z
        .number()
        .min(1, 'Credit amount must be at least 1')
        .nullable(),
    invoiceEmail: z
        .string()
        .email('Invalid email format')
        .nullable()
        .optional(),
});
