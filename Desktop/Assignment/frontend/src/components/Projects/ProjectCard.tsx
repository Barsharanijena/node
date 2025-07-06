import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const handleEdit = (): void => {
    onEdit(project);
  };

  const handleDelete = (): void => {
    onDelete(project._id);
  };

  // Fix: Handle invalid/missing dates
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
        <span className={`status-badge status-${project.status}`}>
          {project.status}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <p className="text-sm text-gray-500 mb-4">
        Created: {formatDate(project.createdAt)}
      </p>
      <div className="flex justify-between items-center">
        <Link
          to={`/project/${project._id}`}
          className="text-blue-600 hover:text-blue-500"
        >
          View Details
        </Link>
        <div className="space-x-2">
          <button
            onClick={handleEdit}
            className="text-gray-600 hover:text-gray-800"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;