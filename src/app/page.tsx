import { LoginForm } from '@/components/login-form';
import { ModeToggle } from '@/components/ui/mode-toggle';
import Image from 'next/image';

export default function Home() {
    return (
        <section className='flex justify-center items-center h-full'>
            <LoginForm />
        </section>
    );
}
