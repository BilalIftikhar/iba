import { Sidebar } from '../components/Sidebar';
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-dvh bg-[#f5f7fa]">
                <Sidebar />
                <main className="flex-1 lg:ml-[260px] ml-0 pt-[60px] lg:pt-0 min-h-dvh overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
