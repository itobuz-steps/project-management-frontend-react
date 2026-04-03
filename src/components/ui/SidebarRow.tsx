import type { SidebarRowType } from './ui.types';

// export function SidebarRow({ label, children }: SidebarRowType) {
//   const hasLabel = Boolean(label);

//   return (
//     <div
//       className={`grid items-start text-sm ${
//         hasLabel ? 'grid-cols-[112px_minmax(0,1fr)]' : 'grid-cols-1'
//       } `}
//     >
//       {hasLabel && (
//         <div className="mr-4 inline-flex w-fit px-2 py-1 text-[11px] leading-6 font-medium tracking-wide text-gray-500 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800">
//           {label}
//         </div>
//       )}

//       <div
//         className={`inline-flex w-fit rounded px-2 py-1 leading-6 ${
//           hasLabel ? 'hover:bg-gray-100 dark:hover:bg-neutral-800' : ''
//         }`}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }
export function SidebarRow({ label, children }: SidebarRowType) {
  const hasLabel = Boolean(label);

  return (
    <div
      className={`grid items-start text-sm ${
        hasLabel ? 'grid-cols-[112px_minmax(0,1fr)]' : 'grid-cols-1'
      }`}
    >
      {hasLabel && (
        <div className="mr-4 inline-flex w-fit px-2 py-1 text-[11px] leading-6 font-medium tracking-wide text-gray-500 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800">
          {label}
        </div>
      )}

      <div
        className={`w-full min-w-0 rounded px-2 py-1 leading-6 ${
          hasLabel ? 'hover:bg-gray-100 dark:hover:bg-neutral-800' : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
}
