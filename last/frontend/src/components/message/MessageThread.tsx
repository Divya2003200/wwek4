
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import {
  Box,
  Button,
  Input,
  Spinner,
  Text,
  VStack,
  HStack,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: { id: number; email: string };
  sentAt: string;
}

interface Props {
  projectId: number;
}

const API_URL = 'http://localhost:3000/api';

const MessageThread: React.FC<Props> = ({ projectId }) => {
  const auth = useAuth();
  const token = auth.token ?? localStorage.getItem('token');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [newText, setNewText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchMessages = async () => {
    if (!token) {
      setError('You must be logged in to view messages.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const resp = await axios.get<Message[]>(
        `${API_URL}/projects/${projectId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(resp.data)
     
      setMessages((prev) => {
        const seen = new Set<number>();
        const combined = [...prev, ...resp.data];
        const unique = combined.filter((msg) => {
          if (seen.has(msg.id)) return false;
          seen.add(msg.id);
          return true;
        });
        return unique;
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not load messages.');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!token) {
      toast({ status: 'error', title: 'Not authenticated' });
      return;
    }
    if (!newText.trim()) return;
    try {
      await axios.post(
        `${API_URL}/projects/${projectId}/messages`,
        { text: newText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewText('');
      setMessages([]); 
      fetchMessages();
    } catch (err: any) {
      toast({
        status: 'error',
        title: err.response?.data?.message || 'Could not send message.',
      });
    }
  };

  useEffect(() => {
    setMessages([]); 
    fetchMessages();
  }, [projectId]);

  if (loading) return <Spinner />;

  return (
    <VStack spacing={4} align="stretch">
      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}
      <Box maxH="300px" overflowY="auto" p={2} borderWidth="1px" borderRadius="md">
        {messages.length === 0 ? (
          <Text>No messages yet.</Text>
        ) : (
          messages.map((m) => (
            <Box key={m.id} mb={2} p={2} bg="gray.50" borderRadius="md">
              {/* <Text fontSize="sm" color="gray.600">
                {new Date(m.sentAt).toLocaleString()} — {m.sender.email}
              </Text> */}
              <Text fontSize="sm" color="gray.600">
  {new Date(m.sentAt).toLocaleString()} — {m.sender?.email || 'Unknown sender'}
</Text>

              <Text mt={1}>{m.text}</Text>
            </Box>
          ))
        )}
      </Box>
      <HStack>
        <Input
          placeholder="Type your message..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <Button colorScheme="teal" onClick={sendMessage}>
          Send
        </Button>
      </HStack>
    </VStack>
  );
};

export default MessageThread;
