import RecallHeader from '@/components/recall-header';
import RecallProductsSearch from '@/components/recall-products-search';

export default function RecallProducts() {
    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40 mt-4'>
            <div className='flex flex-col sm:gap-4 sm:py-4 '>
                <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
                    <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3'>
                        <RecallHeader />
                        <RecallProductsSearch />
                    </div>
                </main>
            </div>
        </div>
    );
}
