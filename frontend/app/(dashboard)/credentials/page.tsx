import { Metadata } from 'next';
import CredentialsClient from '@/app/components/CredentialsClient';

export const metadata: Metadata = {
    title: 'Credentials | IBA',
    description: 'Manage and monitor your API keys, webhooks, and third-party tool credentials securely from a centralized vault.',
};

export default function CredentialsPage() {
    return <CredentialsClient />;
}
