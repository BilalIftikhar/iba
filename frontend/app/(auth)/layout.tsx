import type { Metadata } from 'next';
import './auth.css';

export const metadata: Metadata = {
    title: 'Sign Up — IBA Platform',
    description: 'Create your IBA Platform account to streamline your industrial automation workflows.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
