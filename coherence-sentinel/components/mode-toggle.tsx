'use client';

import { useApp } from '@/lib/context/app-context';
import { Stethoscope, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ModeToggle() {
  const { settings, updateSettings } = useApp();

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => updateSettings({ viewMode: 'clinical' })}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
          settings.viewMode === 'clinical'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        )}
      >
        <Stethoscope className="h-4 w-4" />
        Clinical
      </button>
      <button
        onClick={() => updateSettings({ viewMode: 'myth' })}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
          settings.viewMode === 'myth'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        )}
      >
        <Sparkles className="h-4 w-4" />
        Myth Layer
      </button>
    </div>
  );
}
