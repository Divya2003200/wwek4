


import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Text, VStack, Spinner, useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

interface Bid {
  id: number;
  amount: number;
  duration: number;
  message: string;
  freelancer: { id: number; email: string; name?: string; };
  createdAt: string;
}

interface ProjectBidsProps {
  projectId: number;
}

const ProjectBids: React.FC<ProjectBidsProps> = ({ projectId }) => {
  const auth = useAuth();
  const toast = useToast();
  const token = auth.token ?? localStorage.getItem('token')?.trim() ?? null;
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchBids = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/projects/${projectId}/bids`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBids(res.data);
      } catch (err: any) {
        toast({ title: 'Error', description: err.response?.data?.message || 'Could not load bids.', status: 'error', duration: 5000, isClosable: true });
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, [projectId, token, toast]);

  if (!token) return <Box mt={6}><p>You must be logged in to view bids.</p></Box>;
  if (loading) return <Box mt={6} textAlign="center"><Spinner size="lg" /></Box>;

  return (
    <Box maxW="700px" mx="auto" mt={8} p={4}>
      <Heading as="h2" size="lg" mb={4}>Bids for this Project</Heading>
      {bids.length === 0 ? (
        <Text>No bids yet.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {bids.map(bid => (
            <Box key={bid.id} p={4} borderWidth="1px" borderRadius="md">
              <Text><strong>Amount:</strong> ₹{bid.amount}</Text>
              <Text><strong>Duration:</strong> {bid.duration} days</Text>
              <Text><strong>Freelancer:</strong> {bid.freelancer.name ?? bid.freelancer.email}</Text>
              <Text><strong>Message:</strong> {bid.message}</Text>
              <Text fontSize="sm" color="gray.500">{new Date(bid.createdAt).toLocaleString()}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default ProjectBids;
