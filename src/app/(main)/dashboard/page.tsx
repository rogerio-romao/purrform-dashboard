import { MoveLeft } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className='flex h-full w-full justify-center items-center -mt-[83px] text-lg'>
            <MoveLeft className='mr-2 inline-block' />
            Select an option from the sidebar to view the content.
        </div>
    );
}
