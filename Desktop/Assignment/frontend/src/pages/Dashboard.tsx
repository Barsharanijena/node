import React, { useState, useEffect } from 'react';
import { Project, ProjectFormData } from '../types';
import { projectAPI } from '../services/api';
import ProjectCard from '../components/Projects/ProjectCard';
import ProjectForm from '../components/Projects/ProjectForm';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async (): Promise<void> => {
    try {
      console.log('🔥 CALLING REAL BACKEND API...');
      const response: any = await projectAPI.getProjects();
      console.log('🔥 BACKEND RESPONSE:', response);
      
      // Handle the response - now it should be an array directly
      let projectsData: Project[] = [];
      if (Array.isArray(response)) {
        // Backend returns array directly
        projectsData = response;
      } else if (response && Array.isArray(response.projects)) {
        // Backend returns {projects: [...]}
        projectsData = response.projects;
      }
      
      console.log('🔥 SETTING PROJECTS:', projectsData);
      setProjects(projectsData);
    } catch (err: any) {
      console.error('❌ BACKEND ERROR:', err);
      setError('Failed to load projects from backend');
    } finally {
      setIsLoading(false);
    }
  };

  // Test function
  const testBackend = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': 'Bearer mock-jwt-token'
        }
      });
      const data = await response.json();
      console.log('🔥 DIRECT FETCH TEST:', data);
      alert('Backend response: ' + JSON.stringify(data));
    } catch (error: unknown) {
      console.error('❌ DIRECT FETCH ERROR:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Backend error: ' + errorMessage);
    }
  };

  // CREATE PROJECT - Only one function
  const handleCreateProject = async (data: ProjectFormData): Promise<void> => {
    try {
      console.log('Creating project via backend API:', data);
      const response = await projectAPI.createProject(data);
      console.log('Backend create project response:', response);
      
      const newProject = response;
      setProjects([newProject, ...projects]);
      setShowForm(false); // Close form after creation
      
      console.log('✅ Project created successfully and form closed');
    } catch (err: any) {
      console.error('Failed to create project via backend:', err);
      setError('Failed to create project');
    }
  };

  // UPDATE PROJECT - This was missing
  const handleUpdateProject = async (data: ProjectFormData): Promise<void> => {
    if (!editingProject) return;
    
    try {
      console.log('Updating project via backend API:', editingProject._id, data);
      const response = await projectAPI.updateProject(editingProject._id, data);
      console.log('Backend update project response:', response);
      
      const updatedProject = response;
      setProjects(projects.map(p => p._id === updatedProject._id ? updatedProject : p));
      
      // Close the form and clear editing state
      setEditingProject(null);
      setShowForm(false); // Close form after update
      
      console.log('✅ Project updated successfully and form closed');
    } catch (err: any) {
      console.error('Failed to update project via backend:', err);
      setError('Failed to update project');
    }
  };

  // DELETE PROJECT
  const handleDeleteProject = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      console.log('Deleting project via backend API:', id);
      await projectAPI.deleteProject(id);
      console.log('Project deleted successfully from backend');
      
      setProjects(projects.filter(p => p._id !== id));
    } catch (err: any) {
      console.error('Failed to delete project via backend:', err);
      setError('Failed to delete project');
    }
  };

  // EDIT PROJECT
  const handleEditProject = (project: Project): void => {
    console.log('🔥 EDITING PROJECT:', project);
    setEditingProject(project);
    setShowForm(true);
  };

  // CLOSE FORM
  const handleCloseForm = (): void => {
    setShowForm(false);
    setEditingProject(null);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading projects from backend...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
  <button
    onClick={() => setShowForm(true)}
    className="btn-primary"
  >
    Create New Project
  </button>
  </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={loadProjects}
            className="ml-4 text-sm underline"
          >
            Retry
          </button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded bg-white">
            <ProjectForm
              project={editingProject}
              onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>

      {projects.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No projects from backend yet</p>
          <p className="text-gray-400 mt-2">Create your first project to get started</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;