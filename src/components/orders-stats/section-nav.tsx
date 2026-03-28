const sections = [
    { id: 'csv-reports', label: 'CSV Reports' },
    { id: 'orders-charts', label: 'Last 6 Months Order Stats' },
    { id: 'sales-statistics', label: 'Order Statistics by Time Period' },
    { id: 'coupon-types', label: 'Coupon Types Breakdown' },
    { id: 'coupon-comparison', label: 'Coupon Statistics by Time Period' },
    { id: 'non-coupon-campaigns', label: 'Non-Coupon Campaigns' },
] as const;

export default function SectionNav() {
    return (
        <nav className='sticky top-0 z-10 rounded-lg border bg-background shadow-sm'>
            <div className='scrollbar-none flex items-center gap-1 overflow-x-auto px-4 py-3'>
                {sections.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        className='inline-flex items-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    >
                        {section.label}
                    </a>
                ))}
            </div>
        </nav>
    );
}
