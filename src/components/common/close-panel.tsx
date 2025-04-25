import { X } from 'lucide-react';

interface ClosePanelProps {
    setClosePanel: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ClosePanel({ setClosePanel }: ClosePanelProps) {
    return (
        <div
            className='absolute right-4 top-4 cursor-pointer text-gray-500 flex items-center gap-1 group transition-colors'
            onClick={() => setClosePanel(false)}
        >
            <span className='text-xs group-hover:text-gray-600'>Close</span>
            <X
                size={'22'}
                className='text-gray-400 group-hover:text-gray-500'
            />
        </div>
    );
}
