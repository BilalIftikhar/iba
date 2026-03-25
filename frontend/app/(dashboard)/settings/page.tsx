import { Metadata } from 'next';
import SettingsClient from '@/app/components/SettingsClient';

export const metadata: Metadata = {
    title: 'Settings | IBA',
    description: 'Manage your profile, platform security, and organization notifications.',
};

export default function SettingsPage() {
    return <SettingsClient />;
}
