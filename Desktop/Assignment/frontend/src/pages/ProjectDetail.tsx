import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project, Task, TaskFormData } from '../types';
import { projectAPI, taskAPI } from '../services/api';
import TaskCard from '../components/Tasks/TaskCard';
import TaskForm from '../components/Tasks/TaskForm';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadProjectAndTasks = useCallback(async (): Promise<void> => {
    try {
      // 🔥 REAL API CALLS TO BACKEND
      console.log('Loading project and tasks from backend...');
      
      const [projectResponse, tasksResponse] = await Promise.all([
        projectAPI.getProject(id!),
        taskAPI.getTasks(id!)
      ]);
      
      console.log('Backend project response:', projectResponse);
      console.log('Backend tasks response:', tasksResponse);
      
      // Fix: Handle actual backend response structure
      let projectData: Project | null = null;
      let tasksData: Task[] = [];
      
      if (projectResponse && typeof projectResponse === 'object') {
        projectData = projectResponse.project || projectResponse;
      }
      
      if (Array.isArray(tasksResponse)) {
        tasksData = tasksResponse;
      } else if (tasksResponse && Array.isArray(tasksResponse.tasks)) {
        tasksData = tasksResponse.tasks;
      }
      
      setProject(projectData);
      setTasks(tasksData);
    } catch (err: any) {
      console.error('Failed to load from backend:', err);
      setError('Failed to load project details from backend');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadProjectAndTasks();
    }
  }, [id, loadProjectAndTasks]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === statusFilter));
    }
  }, [tasks, statusFilter]);

  const handleCreateTask = async (data: TaskFormData): Promise<void> => {
  try {
    // 🔥 REAL API CALL TO BACKEND
    console.log('Creating task via backend API:', data);
    const response = await taskAPI.createTask(id!, data);
    console.log('Backend create task response:', response);
    
    // Fix: response IS the task directly
    const newTask = response;
    setTasks([newTask, ...tasks]);
    setShowForm(false); // This should already exist
    
    console.log('✅ Task created successfully and form closed');
  } catch (err: any) {
    console.error('Failed to create task via backend:', err);
    setError('Failed to create task');
  }
};
  const handleUpdateTask = async (data: TaskFormData): Promise<void> => {
  if (!editingTask) return;
  
  try {
    // 🔥 REAL API CALL TO BACKEND
    console.log('Updating task via backend API:', editingTask._id, data);
    const response = await taskAPI.updateTask(editingTask._id, data);
    console.log('Backend update task response:', response);
    
    // Fix: response IS the task directly
    const updatedTask = response;
    setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
    
    // Close the form and clear editing state
    setEditingTask(null);
    setShowForm(false); // ADD THIS LINE
    
    console.log('✅ Task updated successfully and form closed');
  } catch (err: any) {
    console.error('Failed to update task via backend:', err);
    setError('Failed to update task');
  }
};

  const handleDeleteTask = async (taskId: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      // 🔥 REAL API CALL TO BACKEND
      console.log('Deleting task via backend API:', taskId);
      await taskAPI.deleteTask(taskId);
      console.log('Task deleted successfully from backend');
      
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err: any) {
      console.error('Failed to delete task via backend:', err);
      setError('Failed to delete task');
    }
  };

  const handleEditTask = (task: Task): void => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = (): void => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setStatusFilter(e.target.value);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading from backend...</div>;
  }

  if (!project) {
    return <div className="text-center py-8">Project not found in backend</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-500 mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <p className="text-gray-600 mt-2">{project.description}</p>
            <span className={`status-badge status-${project.status} mt-2`}>
              {project.status}
            </span>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Add New Task
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={loadProjectAndTasks}
            className="ml-4 text-sm underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="mb-6">
        <label className="form-label">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="form-input w-48"
        >
          <option value="all">All Tasks</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded bg-white">
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {statusFilter === 'all' ? 'No tasks from backend yet' : `No ${statusFilter} tasks`}
          </p>
          <p className="text-gray-400 mt-2">
            {statusFilter === 'all' ? 'Create your first task to get started' : 'Try changing the filter'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;