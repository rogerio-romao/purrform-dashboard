import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function RecallHeader() {
    return (
        <Card className='sm:col-span-3'>
            <CardHeader className='pb-3'>
                <CardTitle>Recall Products</CardTitle>
                <CardDescription className='leading-relaxed'>
                    Search for a product to recall, with the start and end
                    dates. The system will then search all orders between the
                    dates and display all the emails of customers that purchased
                    the product during that time. You can then write and send an
                    email to all customers.
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
