'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/context/app-context';
import { getLabel } from '@/lib/myth-labels';
import {
  LayoutDashboard,
  Users,
  Activity,
  Cpu,
  Bell,
  FileText,
  ClipboardList,
  Settings
} from 'lucide-react';

const navigation = [
  { name: 'overview', href: '/overview', icon: LayoutDashboard },
  { name: 'patients', href: '/patients', icon: Users },
  { name: 'signals', href: '/signals', icon: Activity },
  { name: 'coherenceEngine', href: '/coherence-engine', icon: Cpu },
  { name: 'alerts', href: '/alerts', icon: Bell },
  { name: 'protocols', href: '/protocols', icon: ClipboardList },
  { name: 'reports', href: '/reports', icon: FileText },
  { name: 'settings', href: '/settings', icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  const { settings } = useApp();

  return (
    <div className="flex h-full flex-col bg-gray-900 text-white w-64">
      {/* Logo / Title */}
      <div className="flex h-16 items-center px-6 border-b border-gray-800">
        <div>
          <h1 className="text-xl font-bold">Coherence Sentinel</h1>
          {settings.viewMode === 'myth' && (
            <p className="text-xs text-gray-400 italic">Clinical Monitoring Station</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
                'transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{getLabel(item.name, settings.viewMode)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer disclaimer */}
      <div className="border-t border-gray-800 px-4 py-3">
        <p className="text-xs text-gray-400">
          {getLabel('disclaimer', settings.viewMode)}
        </p>
      </div>
    </div>
  );
}
