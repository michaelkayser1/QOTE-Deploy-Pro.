'use client';

import { useApp } from '@/lib/context/app-context';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RiskBadge } from './alert-badge';
import * as Select from '@radix-ui/react-select';

export function PatientSelector() {
  const { patients, selectedPatientId, setSelectedPatientId } = useApp();
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <Select.Root value={selectedPatientId || ''} onValueChange={setSelectedPatientId}>
      <Select.Trigger
        className={cn(
          'flex items-center gap-2 px-4 py-2 bg-white border border-gray-200',
          'rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500',
          'min-w-[200px]'
        )}
      >
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-gray-900">
            <Select.Value>
              {selectedPatient?.name || 'Select patient'}
            </Select.Value>
          </div>
          {selectedPatient && (
            <div className="text-xs text-gray-500">
              {selectedPatient.age}y, {selectedPatient.sex}
            </div>
          )}
        </div>
        {selectedPatient && (
          <RiskBadge level={selectedPatient.riskLevel} />
        )}
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className={cn(
            'bg-white border border-gray-200 rounded-lg shadow-lg',
            'overflow-hidden w-[300px] z-50'
          )}
          position="popper"
          sideOffset={5}
        >
          <Select.Viewport>
            {patients.map(patient => (
              <Select.Item
                key={patient.id}
                value={patient.id}
                className={cn(
                  'flex items-center justify-between gap-3 px-4 py-3',
                  'hover:bg-gray-50 cursor-pointer outline-none',
                  'border-b border-gray-100 last:border-b-0'
                )}
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    <Select.ItemText>{patient.name}</Select.ItemText>
                  </div>
                  <div className="text-xs text-gray-500">
                    {patient.age}y, {patient.sex} • ID: {patient.id}
                  </div>
                </div>
                <RiskBadge level={patient.riskLevel} />
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
