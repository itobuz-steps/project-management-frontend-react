import { Tag } from 'antd';
import type { TemplateCardProps } from './createProject.types';

export function TemplateCard({
  template,
  isSelected,
  onClick,
}: TemplateCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex min-h-30 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 p-4 transition-all duration-200 ${
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'hover:border-primary-300 border-transparent bg-gray-100'
      } `}
    >
      <h4 className="text-center text-base font-semibold text-gray-800">
        {template.name}
      </h4>
      <div className="flex flex-wrap justify-center gap-1">
        {template.columns.map((column) => (
          <Tag
            key={column}
            style={{
              backgroundColor: 'var(--color-primary-500)',
              color: 'white',
            }}
          >
            {column}
          </Tag>
        ))}
      </div>
    </div>
  );
}
