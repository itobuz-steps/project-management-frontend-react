import { Modal, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectForm } from './ProjectForm';
import { TemplateSelector } from './TemplateSelector';
import { createProject } from '../../services/projectService';
import type {
  CreateProjectModalProps,
  CreateProjectFormValues,
  Template,
} from './createProject.types';

export function CreateProjectModal({
  open,
  onClose,
  onCreated,
}: CreateProjectModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>();

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplateId(template.id);
    setColumns(template.columns);
  };

  const handleSubmit = async (values: CreateProjectFormValues) => {
    if (columns.length === 0) {
      message.warning('Please add at least one column or select a template.');
      return;
    }

    try {
      setLoading(true);
      const project = await createProject({
        name: values.name,
        projectType: values.projectType,
        columns,
        tasks: [],
      });

      message.success('Project created successfully!');
      onCreated?.(project._id);
      handleClose();
      navigate(`/project/${project._id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      message.error('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setColumns([]);
    setSelectedTemplateId(undefined);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      title={<span className="text-xl font-bold">Create Project</span>}
      width={900}
      destroyOnHidden
      centered
      styles={{
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'none',
        },
      }}
    >
      <div className="grid grid-cols-1 gap-8 py-4 md:grid-cols-2">
        {/* Left Side - Form */}
        <div className="flex flex-col">
          <ProjectForm
            onSubmit={handleSubmit}
            loading={loading}
            columns={columns}
            onColumnsChange={setColumns}
          />
        </div>

        {/* Right Side - Template Selector */}
        <div className="border-l border-gray-200 pl-6">
          <TemplateSelector
            onSelectTemplate={handleSelectTemplate}
            selectedTemplateId={selectedTemplateId}
          />
        </div>
      </div>
    </Modal>
  );
}
