'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Define paths where we don't want Header/Footer
    const isAuthPage = pathname?.startsWith('/auth');
    const isAdminPage = pathname?.startsWith('/admin');

    // Specifically requested: no footer in login and register
    // We'll also hide the main header for auth and admin pages since they usually have their own or none

    return (
        <>
            {!isAuthPage && !isAdminPage && <Header />}
            <main className="min-h-screen">
                {children}
            </main>
            {!isAuthPage && !isAdminPage && <Footer />}
        </>
    );
}
