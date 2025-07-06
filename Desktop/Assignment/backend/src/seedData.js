const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');        // Fixed: ./ instead of ../
const Project = require('./models/Project');  // Fixed: ./ instead of ../
const Task = require('./models/Task');        // Fixed: ./ instead of ../

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    console.log('Cleared existing data');

    // Create test user
    const user = new User({
      email: 'test@example.com',
      password: 'Test@123'
    });
    await user.save();
    console.log('Created test user');

    // Create projects
    const projects = [
      {
        title: 'E-commerce Website',
        description: 'Build a modern e-commerce platform with React and Node.js',
        status: 'active',
        userId: user._id
      },
      {
        title: 'Mobile App Development',
        description: 'Develop a cross-platform mobile app using React Native',
        status: 'active',
        userId: user._id
      }
    ];

    const createdProjects = await Project.insertMany(projects);
    console.log('Created projects');

    // Create tasks for each project
    const tasks = [
      // Tasks for E-commerce Website
      {
        title: 'Setup project structure',
        description: 'Initialize React project and setup folder structure',
        status: 'done',
        priority: 'high',
        dueDate: new Date('2024-01-15'),
        projectId: createdProjects[0]._id
      },
      {
        title: 'Implement user authentication',
        description: 'Add login/register functionality with JWT',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2024-01-30'),
        projectId: createdProjects[0]._id
      },
      {
        title: 'Build product catalog',
        description: 'Create product listing and detail pages',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date('2024-02-15'),
        projectId: createdProjects[0]._id
      },
      // Tasks for Mobile App Development
      {
        title: 'Project planning',
        description: 'Define requirements and create wireframes',
        status: 'done',
        priority: 'high',
        dueDate: new Date('2024-01-10'),
        projectId: createdProjects[1]._id
      },
      {
        title: 'Setup React Native environment',
        description: 'Install and configure React Native development environment',
        status: 'in-progress',
        priority: 'medium',
        dueDate: new Date('2024-01-25'),
        projectId: createdProjects[1]._id
      },
      {
        title: 'Implement core features',
        description: 'Build main app functionality and navigation',
        status: 'todo',
        priority: 'low',
        dueDate: new Date('2024-02-28'),
        projectId: createdProjects[1]._id
      }
    ];

    await Task.insertMany(tasks);
    console.log('Created tasks');

    console.log('✅ Seed data created successfully!');
    console.log('Test user credentials:');
    console.log('Email: test@example.com');
    console.log('Password: Test@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();