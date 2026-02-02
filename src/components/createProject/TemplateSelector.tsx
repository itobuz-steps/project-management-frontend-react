import { TemplateCategory } from './TemplateCategory';
import { templateCategories } from './templateData';
import type { TemplateSelectorProps } from './createProject.types';

export function TemplateSelector({
  onSelectTemplate,
  selectedTemplateId,
}: TemplateSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-primary-500 mb-2 text-lg font-semibold">
        Choose a template
      </h3>
      <div className="max-h-[400px] space-y-1 overflow-y-auto pr-2">
        {templateCategories.map((category, index) => (
          <TemplateCategory
            key={category.id}
            category={category}
            onSelectTemplate={onSelectTemplate}
            selectedTemplateId={selectedTemplateId}
            defaultExpanded={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
