import { Collapse } from 'antd';
import { TemplateCard } from './TemplateCard';
import type { TemplateCategoryProps } from './createProject.types';

export function TemplateCategory({
  category,
  onSelectTemplate,
  selectedTemplateId,
  defaultExpanded = false,
}: TemplateCategoryProps) {
  const items = [
    {
      key: category.id,
      label: (
        <span className="text-base font-semibold text-gray-800 dark:text-neutral-200">
          {category.name}
        </span>
      ),
      children: (
        <div className="grid grid-cols-2 gap-3">
          {category.templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplateId === template.id}
              onClick={() => onSelectTemplate(template)}
            />
          ))}
        </div>
      ),
    },
  ];

  return (
    <Collapse
      items={items}
      defaultActiveKey={defaultExpanded ? [category.id] : []}
      ghost
      className="template-category-collapse"
    />
  );
}
