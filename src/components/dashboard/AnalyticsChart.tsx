'use client';

import { ChevronDown, SlidersHorizontal } from 'lucide-react';

// Lightweight SVG line chart — no extra dependencies needed
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PAY_INS =  [52, 48, 55, 50, 62, 58, 70, 80, 75, 65, 60, 58];
const PAY_OUTS = [25, 20, 28, 22, 30, 28, 35, 42, 38, 30, 28, 26];

const W = 800;
const H = 160;
const PAD = { top: 10, bottom: 10, left: 30, right: 10 };

function toPoints(data: number[]): string {
  const min = 0;
  const max = 100;
  const xStep = (W - PAD.left - PAD.right) / (data.length - 1);
  return data
    .map((v, i) => {
      const x = PAD.left + i * xStep;
      const y = PAD.top + ((max - v) / (max - min)) * (H - PAD.top - PAD.bottom);
      return `${x},${y}`;
    })
    .join(' ');
}

export default function AnalyticsChart({ title = 'Transaction analytics' }: { title?: string }) {
  const inPoints = toPoints(PAY_INS);
  const outPoints = toPoints(PAY_OUTS);
  const xStep = (W - PAD.left - PAD.right) / (MONTHS.length - 1);

  return (
    <div className='bg-white rounded-xl border border-stroke-2 p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-sm font-semibold text-foreground'>{title}</h3>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1 border border-stroke-2 rounded-lg px-2.5 py-1.5 text-xs text-xental-text-primary-500 cursor-pointer'>
            Date <ChevronDown className='w-3 h-3' />
          </div>
          <div className='flex items-center gap-1 border border-stroke-2 rounded-lg px-2.5 py-1.5 text-xs text-xental-text-primary-500 cursor-pointer'>
            <SlidersHorizontal className='w-3 h-3' /> Filters <ChevronDown className='w-3 h-3' />
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H + 30}`} className='w-full h-auto'>
        {/* Y-axis labels */}
        {[0, 2, 4, 6, 8, 10].map((v, i) => (
          <text
            key={i}
            x={PAD.left - 4}
            y={PAD.top + (1 - v / 10) * (H - PAD.top - PAD.bottom)}
            textAnchor='end'
            fontSize='9'
            fill='#94a3b8'
            dominantBaseline='middle'
          >
            {v}K
          </text>
        ))}

        {/* Grid lines */}
        {[0, 2, 4, 6, 8, 10].map((v, i) => {
          const y = PAD.top + (1 - v / 10) * (H - PAD.top - PAD.bottom);
          return (
            <line
              key={i}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y}
              y2={y}
              stroke='#ebebeb'
              strokeWidth='0.5'
            />
          );
        })}

        {/* Pay-ins line */}
        <polyline
          points={inPoints}
          fill='none'
          stroke='#3b82f6'
          strokeWidth='2'
          strokeLinejoin='round'
        />

        {/* Pay-outs line */}
        <polyline
          points={outPoints}
          fill='none'
          stroke='#7c3aed'
          strokeWidth='2'
          strokeLinejoin='round'
        />

        {/* X-axis labels */}
        {MONTHS.map((m, i) => (
          <text
            key={m}
            x={PAD.left + i * xStep}
            y={H + 20}
            textAnchor='middle'
            fontSize='9'
            fill='#94a3b8'
          >
            {m}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className='flex items-center gap-4 mt-1 justify-center'>
        <div className='flex items-center gap-1.5'>
          <div className='w-3 h-0.5 rounded bg-xental-blue-500' />
          <span className='text-[10px] text-xental-text-primary-400'>Pay-ins</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <div className='w-3 h-0.5 rounded bg-purple-600' />
          <span className='text-[10px] text-xental-text-primary-400'>Pay-outs</span>
        </div>
      </div>
    </div>
  );
}
