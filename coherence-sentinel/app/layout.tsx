import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context/app-context';
import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/top-bar';

export const metadata: Metadata = {
  title: 'Coherence Sentinel',
  description: 'Clinical monitoring dashboard for coherence signals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppProvider>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Top bar */}
              <TopBar />

              {/* Page content */}
              <main className="flex-1 overflow-y-auto bg-gray-50">
                {children}
              </main>
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
