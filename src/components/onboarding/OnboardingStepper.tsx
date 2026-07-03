'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { label: 'Business\nInformation' },
  { label: 'Personal\nVerification' },
  { label: 'Business\nDocuments' },
  { label: 'Settlement\nAccount' },
  { label: 'Review &\nSubmit' },
];

interface Props {
  currentStep: number; // 1-indexed
}

export default function OnboardingStepper({ currentStep }: Props) {
  return (
    <div className='flex items-start justify-between w-full max-w-xl mx-auto mb-8'>
      {STEPS.map((step, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={idx} className='flex-1 flex flex-col items-center relative'>
            {/* Connecting line (left side) */}
            {idx > 0 && (
              <div
                className={cn(
                  'absolute top-3.5 right-1/2 left-0 h-px',
                  isCompleted || isActive ? 'bg-action-blue' : 'bg-stroke-2'
                )}
              />
            )}

            {/* Circle */}
            <div
              className={cn(
                'relative z-10 flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold border-2 transition-colors',
                isCompleted
                  ? 'bg-action-blue border-action-blue text-white'
                  : isActive
                    ? 'bg-action-blue border-action-blue text-white'
                    : 'bg-white border-stroke-2 text-xental-text-primary-400'
              )}
            >
              {isCompleted ? <Check className='w-3.5 h-3.5' /> : stepNum}
            </div>

            {/* Label */}
            <span
              className={cn(
                'mt-1.5 text-[10px] text-center leading-tight whitespace-pre-line',
                isActive || isCompleted
                  ? 'text-xental-text-primary-500 font-medium'
                  : 'text-xental-text-primary-400'
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
