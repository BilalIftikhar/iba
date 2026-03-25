import { Metadata } from 'next';
import SubscriptionClient from '@/app/components/SubscriptionClient';

export const metadata: Metadata = {
    title: 'Subscription | IBA',
    description: 'Manage your plan, billing, and resource usage from a central dashboard.',
};

export default function SubscriptionPage() {
    return <SubscriptionClient />;
}
