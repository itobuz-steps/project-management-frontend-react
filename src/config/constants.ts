export const THEME_COLORS: Record<string, string[]> = {
  indigo: [
    'oklch(96.2% 0.018 272.314)',
    'oklch(93% 0.034 272.788)',
    'oklch(87% 0.065 274.039)',
    'oklch(78.5% 0.115 274.713)',
    'oklch(67.3% 0.182 276.935)',
    'oklch(58.5% 0.233 277.117)',
    'oklch(51.1% 0.262 276.966)',
    'oklch(45.7% 0.24 277.023)',
    'oklch(39.8% 0.195 277.366)',
    'oklch(35.9% 0.144 278.697)',
    'oklch(25.7% 0.09 281.288)',
  ],

  rose: [
    'oklch(0.969 0.015 12.422)',
    'oklch(0.941 0.03 12.58)',
    'oklch(0.892 0.058 10.001)',
    'oklch(0.81 0.117 11.638)',
    'oklch(0.712 0.194 13.428)',
    'oklch(0.645 0.246 16.439)',
    'oklch(0.586 0.253 17.585)',
    'oklch(0.514 0.222 16.935)',
    'oklch(0.455 0.188 13.697)',
    'oklch(0.41 0.159 10.272)',
    'oklch(0.271 0.105 12.094)',
  ],

  purple: [
    'oklch(0.977 0.014 308.299)',
    'oklch(0.946 0.033 307.174)',
    'oklch(0.902 0.063 306.703)',
    'oklch(0.827 0.119 306.383)',
    'oklch(0.714 0.203 305.504)',
    'oklch(0.627 0.265 303.9)',
    'oklch(0.558 0.288 302.321)',
    'oklch(0.496 0.265 301.924)',
    'oklch(0.438 0.218 303.724)',
    'oklch(0.381 0.176 304.987)',
    'oklch(0.291 0.149 302.717)',
  ],
  brown: [
    '#fbf5f5',
    '#f8ebec',
    '#f0dbdd',
    '#e4bdc2',
    '#d79da6',
    '#c27180',
    '#ab5368',
    '#8e4255',
    '#78394b',
    '#683344',
    '#381922',
  ],

  green: [
    '#edfcf2',
    '#d4f7de',
    '#adedc3',
    '#77dea0',
    '#52cc87',
    '#1dac60',
    '#108b4c',
    '#0d6f3f',
    '#0d5834',
    '#0c482c',
    '#052919',
  ],

  'digital-blue': [
    '#e5f0ff',
    '#cce0ff',
    '#99c2ff',
    '#66a3ff',
    '#3385ff',
    '#0066ff',
    '#0052cc',
    '#003d99',
    '#002966',
    '#001433',
    '#000e24',
  ],

  'jet-black': [
    '#f0f1f4',
    '#e2e3e9',
    '#c4c8d4',
    '#a7acbe',
    '#8a90a8',
    '#6c7593',
    '#575d75',
    '#414658',
    '#2b2f3b',
    '#16171d',
    '#0f1015',
  ],

  'bright-fern': [
    '#f3fbea',
    '#e6f6d5',
    '#cdedab',
    '#b4e481',
    '#9bdb57',
    '#82d22d',
    '#68a824',
    '#4e7e1b',
    '#345412',
    '#1a2a09',
    '#121d06',
  ],

  'dusty-grape': [
    '#f0eff6',
    '#e1dfec',
    '#c2bfd9',
    '#a49fc6',
    '#867eb4',
    '#675ea1',
    '#534b81',
    '#3e3960',
    '#292640',
    '#151320',
    '#0e0d16',
  ],

  chocolate: [
    '#f9f0eb',
    '#f4e2d7',
    '#e8c5b0',
    '#dda788',
    '#d18a61',
    '#c66d39',
    '#9e572e',
    '#774122',
    '#4f2c17',
    '#28160b',
    '#1c0f08',
  ],
};

export const GRAY_SHADES = [
  '#d1d5db',
  '#9ca3af',
  '#6b7280',
  '#4b5563',
  '#374151',
  '#1f2937',
  '#111827',
];

export const taskTableColumns = [
  { label: 'Type', className: 'p-2 text-center' },
  { label: 'Key', className: 'p-2' },
  { label: 'Summary', className: 'p-3 px-6' },
  { label: 'Status', className: 'p-3 px-6' },
  { label: 'Assignee', className: 'p-3 px-6 truncate w-[200px]' },
  { label: 'Due Date', className: 'p-3 px-6 min-w-[150px]' },
  { label: 'Labels', className: 'p-3 px-6' },
  { label: 'Created', className: 'p-3 px-6' },
  { label: 'Updated', className: 'p-3 px-6' },
  { label: 'Reporter', className: 'p-3 px-6 truncate w-[200px]' },
];

export const EPIC_PROGRESS_LEGEND = [
  { label: 'Done', className: 'bg-green-400' },
  { label: 'In progress', className: 'bg-blue-500' },
  { label: 'To do', className: 'bg-slate-400' },
] as const;

export function getProgressColorClass(percentage: number): string {
  if (percentage === 0) return 'bg-slate-400';
  if (percentage < 40) return 'bg-red-400';
  if (percentage < 70) return 'bg-blue-500';
  return 'bg-green-400';
}

export function getProgressLabel(percentage: number): string {
  if (percentage === 0) return 'To do';
  if (percentage === 100) return 'Done';
  return 'In progress';
}
