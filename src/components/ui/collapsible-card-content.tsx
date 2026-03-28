'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface CollapseToggleButtonProps {
    isExpanded: boolean;
    onToggle: () => void;
}

export function CollapseToggleButton({
    isExpanded,
    onToggle,
}: CollapseToggleButtonProps) {
    return (
        <Button
            variant='ghost'
            size='icon'
            onClick={onToggle}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
            {isExpanded ? (
                <ChevronUp className='h-4 w-4' />
            ) : (
                <ChevronDown className='h-4 w-4' />
            )}
        </Button>
    );
}

interface CollapsibleContentProps {
    isExpanded: boolean;
    children: React.ReactNode;
}

export function CollapsibleContent({
    isExpanded,
    children,
}: CollapsibleContentProps) {
    return (
        <div
            className='grid transition-all duration-300 ease-in-out'
            style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
        >
            <div className='overflow-hidden'>{children}</div>
        </div>
    );
}
