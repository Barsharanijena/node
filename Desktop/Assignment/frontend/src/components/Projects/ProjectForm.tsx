import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Project, ProjectFormData } from '../../types';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  status: yup.string().oneOf(['active', 'completed'] as const).required('Status is required'),
});

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel }) => {
  const isEditing = !!project;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      status: project?.status || 'active',
    },
  });

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {isEditing ? 'Edit Project' : 'Create New Project'}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="form-label">Title</label>
          <input
            {...register('title')}
            type="text"
            className="form-input"
            placeholder="Enter project title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="form-input"
            placeholder="Enter project description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Status</label>
          <select {...register('status')} className="form-input">
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;