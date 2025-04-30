import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import { Milestone ,CreateInvoiceFormProps} from '@/types/milestonetypes';



const CreateInvoiceForm: React.FC<CreateInvoiceFormProps> = ({ projectId }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);
  const auth = useAuth();
  const token = auth.token ?? localStorage.getItem('token')?.trim() ?? null;
  const toast = useToast();

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await axios.get<Milestone[]>(
          `http://localhost:3000/api/projects/${projectId}/milestones`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMilestones(response.data);
      } catch (error) {
        console.error('Error fetching milestones:', error);
        toast({
          title: 'Error',
          description: 'Failed to load milestones.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    if (token) {
      fetchMilestones();
    }
  }, [projectId, token, toast]);

  const handleSubmit = async () => {
    if (selectedMilestone && token) {
      try {
        await axios.post(
          `http://localhost:3000/api/milestones/${selectedMilestone}/invoices`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({
          title: 'Invoice Created',
          description: 'Your invoice has been successfully created.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error: any) {
        console.error('Error creating invoice:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'There was an error creating the invoice.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: 'Error',
        description: 'Please select a milestone.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="lg">
      <FormControl isRequired>
        <FormLabel>Milestone</FormLabel>
        <Select
          placeholder="Select Milestone"
          onChange={(e) => setSelectedMilestone(Number(e.target.value))}
        >
          {milestones.map((milestone) => (
            <option key={milestone.id} value={milestone.id}>
              {milestone.title}
            </option>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleSubmit} colorScheme="blue" mt={4}>
        Create Invoice
      </Button>
    </Box>
  );
};

export default CreateInvoiceForm;
