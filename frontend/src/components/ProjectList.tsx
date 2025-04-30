import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // Import jwt-decode
import { useAuth } from '../hooks/useAuth';
import { Project } from '../types/project';
import {
  Button,
  Box,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Heading,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import CreateBid from './bid/createBid';
import ProjectBids from './bid/projectBids';
import CreateInvoiceForm from './invoice/createinvoiceform';
import InvoiceListClient from './invoice/invoiceListClientview';
import MilestoneForm from './milestones/milestoneForm';
import MilestoneList from './milestones/milestoneList';
import {
  fetchMyProjects,
  fetchProjectDetails,
  updateProject,
  deleteProject,
  assignFreelancer,
  fetchFreelancerProjects,
} from './ProjectActions';


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

  // Decode the token and get the user role directly here
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

  const userRole = getRoleFromToken(token);  // Decode the role directly from the token

  // ADD THIS: log role and token
  useEffect(() => {
    console.log('🛂 Logged-in role:', userRole); // Use the decoded role
    console.log('🔐 Token:', token);
  }, [userRole, token]);

  // const handleFetchMyProjects = async () => {
  //   if (!token) {
  //     setError('❌ Missing token. Please login.');
  //     return;
  //   }

  //   try {
  //     console.log('📦 Fetching user projects...');
  //     setLoading(true);
  //     const data = await fetchMyProjects(token);
  //     console.log('✅ Projects fetched:', data);
  //     setProjects(data);
  //   } catch (err) {
  //     console.error('❌ Error fetching projects:', err);
  //     setError('⚠️ Failed to fetch your projects');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // const handleFetchMyProjects = async () => {
  //   if (!token) {
  //     setError('❌ Missing token. Please login.');
  //     return;
  //   }
  
  //   if (userRole === 'freelancer') {
  //     // Freelancer should only fetch freelancer-specific projects
  //     try {
  //       console.log('Fetching freelancer projects...');
  //       console.log("token is" +token);  // Check if token is valid

  //       setLoading(true);
  //       const data = await fetchFreelancerProjects(token);
  //       console.log(' Freelancer projects fetched:', data);
  //       setProjects(data); // Store freelancer projects
  //     } catch (err) {
  //       console.error(' Error fetching freelancer projects:', err);
  //       setError('Failed to fetch freelancer projects');
  //     } finally {
  //       setLoading(false);
  //     }
  //   } else if (userRole === 'client') {
  //     // Only fetch regular user projects if the role is client
  //     try {
  //       console.log(' Fetching client projects...');
  //       setLoading(true);
  //       const data = await fetchMyProjects(token);
  //       console.log(' Client projects fetched:', data);
  //       setProjects(data); // Store client projects
  //     } catch (err) {
  //       console.error('Error fetching client projects:', err);
  //       setError(' Failed to fetch your projects');
  //     } finally {
  //       setLoading(false);
  //     }
  //   } else {
  //     // Handle unexpected roles or cases
  //     console.log(' Unknown role, cannot fetch projects.');
  //     setError(' Unknown role detected.');
  //   }
  // };



  
  const handleFetchMyProjects = async () => {
    if (!token) {
      setError(' Missing token. Please login.');
      return;
    }
  
    if (userRole === 'freelancer') {
      // Freelancer should only fetch freelancer-specific projects
      try {
        console.log('Fetching freelancer projects...');
        console.log("token is", token);  // Debugging token validity
  
        setLoading(true);
        const data = await fetchFreelancerProjects(token);
        console.log('Freelancer projects fetched:', data);
        setProjects(data); // Store freelancer projects
      } catch (err) {
        console.error('Error fetching freelancer projects:', err);
        const errorMessage = 'Failed to fetch freelancer projects';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    } else if (userRole === 'client') {
      // Only fetch regular user projects if the role is client
      try {
        console.log('📦 Fetching client projects...');
        setLoading(true);
        const data = await fetchMyProjects(token);
        console.log('Client projects fetched:', data);
        setProjects(data); // Store client projects
      } catch (err) {
        console.error('Error fetching client projects:', err);
        const errorMessage = '⚠️ Failed to fetch your projects';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      // Handle unexpected roles or cases
      console.log('⚠️ Unknown role, cannot fetch projects.');
      setError('⚠️ Unknown role detected.');
    }
  };
  

  const handleFetchProjectDetails = async (id: number) => {
    if (!token) return;

    try {
      console.log(`🔍 Fetching project details for ID ${id}`);
      const data = await fetchProjectDetails(id, token);
      console.log('✅ Project details:', data);
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
      console.error(' Error fetching project details:', err);
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
      console.log('⚠️ No changes detected.');
      setError('⚠️ No changes to update');
      return;
    }

    try {
      console.log('📝 Updating project with fields:', updatedFields);
      await updateProject(selectedProject.id, updatedFields, token);
      alert('✅ Project updated successfully');
      handleFetchMyProjects();
      setIsModalOpen(false);
    } catch (err) {
      console.error('❌ Error updating project:', err);
      setError('⚠️ Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject || !token) return;

    try {
      console.log(`🗑️ Deleting project ID ${selectedProject.id}`);
      await deleteProject(selectedProject.id, token);
      alert('🗑️ Project deleted successfully');
      handleFetchMyProjects();
      setIsModalOpen(false);
    } catch (err) {
      console.error('❌ Error deleting project:', err);
      setError('⚠️ Failed to delete project');
    }
  };

  const handleAssignFreelancer = async () => {
    if (!selectedProject || !token || !freelancerId) return;

    try {
      console.log(`👤 Assigning freelancer ID ${freelancerId} to project ${selectedProject.id}`);
      await assignFreelancer(selectedProject.id, freelancerId, token);
      alert('👤 Freelancer assigned successfully');
      handleFetchMyProjects();
      setIsModalOpen(false);
    } catch (err) {
      console.error('❌ Error assigning freelancer:', err);
      setError('⚠️ Failed to assign freelancer');
    }
  };

  useEffect(() => {
    if (viewProjects) handleFetchMyProjects();
  }, [viewProjects]);

  const handleFieldChange = (field: keyof Project, value: string | number) => {
    if (!selectedProject) return;
    console.log(`✏️ Changing field ${field} to`, value);
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
                <Card
                  key={project.id}
                  borderWidth="1px"
                  borderRadius="md"
                  overflow="hidden"
                  onClick={() => handleFetchProjectDetails(project.id)}
                  cursor="pointer"
                >
                  <CardHeader bg="teal.500" color="white" p={4}>
                    <Heading size="md">{project.title}</Heading>
                  </CardHeader>
                  <CardBody p={4}>
                    <Text mb={2}><strong>Description:</strong> {project.description}</Text>
                    <Text mb={2}><strong>Budget:</strong> ₹{project.budget}</Text>
                    <Text mb={2}><strong>Deadline:</strong> {project.deadline}</Text>
                    <Divider my={4} />
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Box>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedProject?.title ?? 'Project Details'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isEditing ? (
              <>
                <FormControl mt={2}>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={selectedProject?.title || ''}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                  />
                </FormControl>

                <FormControl mt={2}>
                  <FormLabel>Description</FormLabel>
                  <Input
                    value={selectedProject?.description || ''}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                  />
                </FormControl>

                <FormControl mt={2}>
                  <FormLabel>Budget</FormLabel>
                  <Input
                    type="number"
                    value={selectedProject?.budget || ''}
                    onChange={(e) => handleFieldChange('budget', Number(e.target.value))}
                  />
                </FormControl>

                <FormControl mt={2}>
                  <FormLabel>Deadline</FormLabel>
                  <Input
                    type="date"
                    value={selectedProject?.deadline || ''}
                    onChange={(e) => handleFieldChange('deadline', e.target.value)}
                  />
                </FormControl>
              </>
            ) : (
              <>
                <Text><strong>Description:</strong> {selectedProject?.description}</Text>
                <Text><strong>Budget:</strong> ₹{selectedProject?.budget}</Text>
                <Text><strong>Deadline:</strong> {selectedProject?.deadline}</Text>
              </>
            )}

            <FormControl mt={4}>
              <FormLabel>Freelancer ID</FormLabel>
              <Input
                type="number"
                value={freelancerId}
                onChange={(e) => setFreelancerId(e.target.value)}
              />
            </FormControl>

            {/* Conditionally render based on role */}
            {userRole === 'freelancer' && selectedProject && (
              <>
                <Divider my={4} />
                <CreateBid projectId={selectedProject.id} />
                <CreateInvoiceForm projectId={selectedProject.id} />
              </>
            )}

            {userRole === 'client' && selectedProject && (
              <>
                <Divider my={4} />
                <ProjectBids projectId={selectedProject.id} />
                <InvoiceListClient projectId={selectedProject.id} />
              </>
            )}

            {/* Always show milestones */}
            {selectedProject && (
              <>
                <Divider my={4} />
                <MilestoneList projectId={selectedProject.id} />
                {userRole === 'client' && (
                  <MilestoneForm
                    projectId={selectedProject.id}
                    onComplete={() => handleFetchProjectDetails(selectedProject.id)}
                  />
                )}
              </>
            )}


        {userRole === 'client' && selectedProject && (
              <>
                <Divider my={4} />
                <CreateInvoiceForm projectId={selectedProject.id} />
                 
              </>
            )}

     

          </ModalBody>

          <ModalFooter>
            {isEditing ? (
              <Button colorScheme="teal" onClick={handleUpdateProject} mr={2}>
                Save
              </Button>
            ) : (
              <Button colorScheme="blue" onClick={() => setIsEditing(true)} mr={2}>
                Edit
              </Button>
            )}

            <Button colorScheme="red" onClick={handleDeleteProject} mr={2}>
              Delete
            </Button>
            <Button colorScheme="purple" onClick={handleAssignFreelancer} mr={2}>
              Assign
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MyProjects;
