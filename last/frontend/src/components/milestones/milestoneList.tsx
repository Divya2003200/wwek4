


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Heading, Text, Stack, Button, HStack
} from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';

interface Milestone {
  id: number;
  title: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'completed';
}

interface MilestoneListProps {
  projectId: number;
}

const API_URL = 'http://localhost:3000/api';

// Decode JWT to get roles from token
const decodeRoleFromToken = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload.roles?.[0] ?? null;
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
};

const MilestoneList: React.FC<MilestoneListProps> = ({ projectId }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const auth = useAuth();
  const token = auth.token ?? localStorage.getItem('token');
  const role = decodeRoleFromToken(token);

  useEffect(() => {
    console.log('Decoded role:', role); // should show 'client'
  }, [role]);

  const fetchMilestones = async () => {
    const res = await axios.get<Milestone[]>(
      `${API_URL}/projects/${projectId}/milestones`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMilestones(res.data);
  };

  useEffect(() => {
    fetchMilestones();
  }, [projectId]);

  const markComplete = async (id: number) => {
    await axios.patch(
      `${API_URL}/projects/${projectId}/milestones/${id}`,
      { status: 'completed' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchMilestones();
  };

  return (
    <Box>
      <Heading size="md" mb={4}>Milestones</Heading>
      <Stack spacing={3}>
        {milestones.map(m => (
          <Box key={m.id} p={3} borderWidth="1px" borderRadius="md">
            <HStack justify="space-between">
              <Box>
                <Text fontWeight="bold">{m.title}</Text>
                <Text>Due: {new Date(m.dueDate).toLocaleDateString()}</Text>
                <Text>Amount: ₹{m.amount}</Text>
                <Text>Status: {m.status}</Text>
              </Box>
              {m.status === 'pending' && role === 'client' && (
                <Button size="sm" onClick={() => markComplete(m.id)}>Mark Completed</Button>
              )}
            </HStack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default MilestoneList;
