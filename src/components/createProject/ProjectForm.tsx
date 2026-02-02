import { Input, Select, Button } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import type {
  ProjectFormProps,
  CreateProjectFormValues,
} from './createProject.types';
import type { ProjectType } from '../../types/project.types';

const projectTypeOptions: { value: ProjectType; label: string }[] = [
  { value: 'kanban', label: 'Kanban' },
  { value: 'scrum', label: 'Scrum' },
];

export function ProjectForm({
  onSubmit,
  loading,
  columns,
  onColumnsChange,
}: ProjectFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectFormValues>({
    defaultValues: {
      name: '',
      projectType: 'kanban',
      columns: [],
    },
  });

  const onFormSubmit = (values: CreateProjectFormValues) => {
    onSubmit({
      ...values,
      columns,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex h-full flex-col"
    >
      <div className="flex-1 space-y-3">
        {/* Name Field */}
        <div className="flex flex-col gap-1">
          <label className="text-primary-500 font-semibold">Name</label>
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Please fill out this field.',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters.',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter project name"
                size="large"
                status={errors.name ? 'error' : undefined}
              />
            )}
          />
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name.message}</span>
          )}
        </div>

        {/* Project Type Field */}
        <div className="flex flex-col gap-1">
          <label className="text-primary-500 font-semibold">Project Type</label>
          <Controller
            name="projectType"
            control={control}
            rules={{ required: 'Please select a project type.' }}
            render={({ field }) => (
              <Select
                {...field}
                options={projectTypeOptions}
                size="large"
                status={errors.projectType ? 'error' : undefined}
              />
            )}
          />
          {errors.projectType && (
            <span className="text-xs text-red-500">
              {errors.projectType.message}
            </span>
          )}
        </div>

        {/* Columns Field */}
        <div className="flex flex-col gap-1">
          <label className="text-primary-500 font-semibold">Columns</label>
          <Select
            mode="tags"
            size="large"
            placeholder="Add columns (e.g., To Do, In Progress, Done)"
            value={columns}
            onChange={onColumnsChange}
            tokenSeparators={[',']}
            className="w-full"
          />
          <span className="text-xs text-gray-500">
            Columns define the workflow stages for your project
          </span>
        </div>
      </div>

      <div className="mt-6">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
          className="h-12 text-base font-semibold"
          style={{ backgroundColor: 'var(--color-primary-500)' }}
        >
          Create
        </Button>
      </div>
    </form>
  );
}
