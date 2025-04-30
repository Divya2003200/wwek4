


import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

const CreateProject: React.FC = () => {
  const auth = useAuth();
  const toast = useToast();

  // fallback to raw localStorage if context token is not yet set
  const token = auth.token ?? localStorage.getItem('token')?.trim() ?? null;
  console.log('Effective token in CreateProject:', token);

  if (!token) {
    return (
      <Box maxW="md" mx="auto" mt={8} p={4}>
        <p>You must be logged in to create a project.</p>
      </Box>
    );
  }

  // State to control form visibility
  const [isFormVisible, setIsFormVisible] = useState(true);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      budget: '',     
      deadline: '', 
    },
    onSubmit: async (values) => {
      
      const payload = {
        title: values.title,
        description: values.description,
        category: values.category,
        budget: Number(values.budget),  
        deadline: values.deadline,      
      };

      console.log('Submitting payload:', payload);

      try {
        await axios.post(
          'http://localhost:3000/api/projects',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Show success toast
        toast({
          title: 'Success',
          description: 'Project created successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        
        setIsFormVisible(false);
      } catch (err: any) {
        console.error('API error:', err.response?.data || err);
        toast({
          title: 'Error',
          description: err.response?.data?.message || 'Something went wrong.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    },
  });

  return (
    <Box maxW="500px" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="lg">
      {isFormVisible && (
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                placeholder="Project Title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                placeholder="Project Description"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                placeholder="Select Category"
              >
                <option value="web">Web Development</option>
                <option value="mobile">Mobile App</option>
                <option value="design">UI/UX Design</option>
                <option value="data">Data Science</option>
                <option value="marketing">Marketing</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Budget (₹)</FormLabel>
              <Input
                name="budget"
                type="number"
                value={formik.values.budget}
                onChange={formik.handleChange}
                placeholder="Budget in ₹"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Deadline</FormLabel>
              <Input
                name="deadline"
                type="date"
                value={formik.values.deadline}
                onChange={formik.handleChange}
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" width="full">
              Create Project
            </Button>
          </VStack>
        </form>
      )}
    </Box>
  );
};

export default CreateProject;
