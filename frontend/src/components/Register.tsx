

import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const toast = useToast();
  const navigate=useNavigate()
  const { setToken } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'freelancer'>('client');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Only try to register
      await axios.post(
        'http://localhost:3000/api/auth/register',
        { name, email, password, role },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      toast({
        status: 'success',
        description: 'Registered successfully! Please login.',
      });
  
      // ✅ Redirect to login page after successful registration
      navigate('/login');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        'Registration failed';
      toast({ status: 'error', description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your full name"
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            minLength={6}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </FormControl>

        <FormControl id="role" isRequired>
          <FormLabel>Role</FormLabel>
          <Select value={role} onChange={e => setRole(e.target.value as any)}>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="blue" isLoading={loading}>
          Register
        </Button>
      </Stack>
    </Box>
  );
};

export default Register;
