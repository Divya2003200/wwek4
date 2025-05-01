

import React, { useEffect, useState } from 'react';
import {
  Box, Button, FormControl, FormLabel,
  Input, Textarea, VStack, useToast,
  Alert, AlertIcon
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

interface CreateBidProps {
  projectId: number;
}

const CreateBid: React.FC<CreateBidProps> = ({ projectId }) => {
  const auth = useAuth();
  const toast = useToast();
  const token = auth.token ?? localStorage.getItem('token')?.trim() ?? null;
  const [isValidProjectId, setIsValidProjectId] = useState(false);

  useEffect(() => {
    setIsValidProjectId(!isNaN(projectId));
  }, [projectId]);

  const formik = useFormik({
    initialValues: { amount: '', duration: '', message: '' },
    onSubmit: async (values) => {
      if (!isValidProjectId) {
        toast({ title: 'Error', description: 'Invalid project ID', status: 'error', duration: 5000, isClosable: true });
        return;
      }
      try {
        await axios.post(
          `http://localhost:3000/api/projects/${projectId}/bids`,
          {
            amount: Number(values.amount),
            duration: Number(values.duration),
            message: values.message,
            projectId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({ title: 'Bid Placed', description: 'Your bid has been submitted.', status: 'success', duration: 3000, isClosable: true });
        formik.resetForm();
      } catch (err: any) {
        toast({ title: 'Error', description: err.response?.data?.message || 'Failed to submit bid.', status: 'error', duration: 5000, isClosable: true });
      }
    },
  });

  if (!token) {
    return <Box mt={6} textAlign="center"><p>You must be logged in to place a bid.</p></Box>;
  }
  if (!isValidProjectId) {
    return (
      <Box mt={6} textAlign="center">
        <Alert status="error"><AlertIcon />Invalid project ID.</Alert>
      </Box>
    );
  }

  return (
    <Box maxW="500px" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="lg">
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Amount (₹)</FormLabel>
            <Input name="amount" type="number" min="0" placeholder="Enter bid amount" value={formik.values.amount} onChange={formik.handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Duration (days)</FormLabel>
            <Input name="duration" type="number" min="1" placeholder="How many days" value={formik.values.duration} onChange={formik.handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea name="message" placeholder="Write a brief message" value={formik.values.message} onChange={formik.handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="teal" width="full">Submit Bid</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateBid;
