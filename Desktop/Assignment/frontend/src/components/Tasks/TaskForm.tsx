import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format, isValid } from 'date-fns';
import { Task, TaskFormData } from '../../types'; // Use the corrected types

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  status: yup.string().oneOf(['todo', 'in-progress', 'done'] as const).required('Status is required'),
  priority: yup.string().oneOf(['low', 'medium', 'high'] as const).required('Priority is required'),
  dueDate: yup.string().required('Due date is required'),
});

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskFormData) => void; // Use the corrected TaskFormData
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  // Safe date formatting for form input
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isValid(date)) {
        return format(date, 'yyyy-MM-dd');
      } else {
        return '';
      }
    } catch (error) {
      console.error('Date formatting error in form:', error);
      return '';
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      dueDate: formatDateForInput(task?.dueDate) || '', // Ensure it's always a string
    },
  });

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {task ? 'Edit Task' : 'Create New Task'}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="form-label">Title</label>
          <input
            {...register('title')}
            type="text"
            className="form-input"
            placeholder="Enter task title"
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
            placeholder="Enter task description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Status</label>
          <select {...register('status')} className="form-input">
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Priority</label>
          <select {...register('priority')} className="form-input">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Due Date</label>
          <input
            {...register('dueDate')}
            type="date"
            className="form-input"
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
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
            {task ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;