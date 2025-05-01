


import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../hooks/useAuth';
import { Project } from '../types/project';
import {
  Box,
  Button,
  Alert,
  AlertIcon,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react';
import {
  fetchMyProjects,
  fetchProjectDetails,
  updateProject,
  deleteProject,
  assignFreelancer,
  fetchFreelancerProjects,
} from './ProjectActions';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const MyProjects = () => {
  const auth = useAuth();
  const token = auth.token ?? localStorage.getItem('token')?.trim() ?? null;

  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewProjects, setViewProjects] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [freelancerId, setFreelancerId] = useState<number | string>('');
  const [originalValues, setOriginalValues] = useState<any>({
    title: '',
    description: '',
    budget: '',
    deadline: '',
  });

  const getRoleFromToken = (token: string | null): string | null => {
    try {
      if (token) {
        const decoded: any = jwtDecode(token);
        return decoded?.roles?.[0] ?? null;
      }
      return null;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  };

  const userRole = getRoleFromToken(token);

  useEffect(() => {
    console.log(' Logged-in role:', userRole);
    console.log(' Token:', token);
  }, [userRole, token]);

  const handleFetchMyProjects = async () => {
    if (!token) {
      setError('Missing token. Please login.');
      return;
    }

    if (userRole === 'freelancer') {
      try {
        console.log('Fetching freelancer projects...');
        console.log("token is", token);

        setLoading(true);
        const data = await fetchFreelancerProjects(token);
        console.log('Freelancer projects fetched:', data);
        setProjects(data);
      } catch (err) {
        console.error('Error fetching freelancer projects:', err);
        setError('Failed to fetch freelancer projects');
      } finally {
        setLoading(false);
      }
    } else if (userRole === 'client') {
      try {
        console.log(' Fetching client projects...');
        setLoading(true);
        const data = await fetchMyProjects(token);
        console.log('Client projects fetched:', data);
        setProjects(data);
      } catch (err) {
        console.error('Error fetching client projects:', err);
        setError(' Failed to fetch your projects');
      } finally {
        setLoading(false);
      }
    } else {
      console.log(' Unknown role, cannot fetch projects.');
      setError(' Unknown role detected.');
    }
  };

  const handleFetchProjectDetails = async (id: number) => {
    if (!token) return;

    try {
      console.log(` Fetching project details for ID ${id}`);
      const data = await fetchProjectDetails(id, token);
      console.log(' Project details:', data);
      setSelectedProject(data);
      setOriginalValues({
        title: data.title,
        description: data.description,
        budget: data.budget,
        deadline: data.deadline,
      
      });
      setIsModalOpen(true);
      setIsEditing(false);
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError('Failed to fetch project details');
    }
  };

  const handleUpdateProject = async () => {
    if (!selectedProject || !token) return;

    const updatedFields: Partial<Project> = {};
    if (selectedProject.title !== originalValues.title) updatedFields.title = selectedProject.title;
    if (selectedProject.description !== originalValues.description) updatedFields.description = selectedProject.description;
    if (selectedProject.budget !== originalValues.budget) updatedFields.budget = selectedProject.budget;
    if (selectedProject.deadline !== originalValues.deadline) updatedFields.deadline = selectedProject.deadline;

    if (Object.keys(updatedFields).length === 0) {
      console.log(' No changes detected.');
      setError(' No changes to update');
      return;
    }

    try {
      console.log(' Updating project with fields:', updatedFields);
      await updateProject(selectedProject.id, updatedFields, token);
      alert('Project updated successfully');
      handleFetchMyProjects();
      setIsModalOpen(false);
    } catch (err) {
      console.error(' Error updating project:', err);
      setError(' Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject || !token) return;

    try {
      console.log(` Deleting project ID ${selectedProject.id}`);
      await deleteProject(selectedProject.id, token);
      alert('Project deleted successfully');
      handleFetchMyProjects();
      setIsModalOpen(false);
    } catch (err) {
      console.error(' Error deleting project:', err);
      setError('Failed to delete project');
    }
  };

  const handleAssignFreelancer = async () => {
    if (!selectedProject || !token || !freelancerId) return;

    try {
      console.log(` Assigning freelancer ID ${freelancerId} to project ${selectedProject.id}`);
      await assignFreelancer(selectedProject.id, freelancerId, token);
      alert(' Freelancer assigned successfully');
      handleFetchMyProjects();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error assigning freelancer:', err);
      setError('⚠️ Failed to assign freelancer');
    }
  };

  useEffect(() => {
    if (viewProjects) handleFetchMyProjects();
  }, [viewProjects]);

  const handleFieldChange = (field: keyof Project, value: string | number) => {
    if (!selectedProject) return;
    console.log(`Changing field ${field} to`, value);
    setSelectedProject({ ...selectedProject, [field]: value });
  };

  return (
    <Box p={4}>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Button onClick={() => setViewProjects((prev) => !prev)} colorScheme="teal" mb={4}>
        {viewProjects ? 'Hide Projects' : 'View Projects'}
      </Button>

      {viewProjects && (
        <Box mt={4}>
          {loading ? (
            <Spinner size="lg" />
          ) : projects.length === 0 ? (
            <Text>No projects found.</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={handleFetchProjectDetails}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedProject={selectedProject}
        isEditing={isEditing}
        userRole={userRole}
        freelancerId={freelancerId}
        onFreelancerIdChange={(value) => setFreelancerId(value)}
        onFieldChange={handleFieldChange}
        onUpdate={handleUpdateProject}
        onDelete={handleDeleteProject}
        onAssign={handleAssignFreelancer}
        onEditToggle={() => setIsEditing(!isEditing)}
      />
    </Box>
  );
};

export default MyProjects;

